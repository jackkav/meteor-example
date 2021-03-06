//TODO: move to config
var localDevServer = process.env.DOCKER_URL ? process.env.DOCKER_URL : "http://192.168.1.10"
var isDev = process.env.ROOT_URL.indexOf('localhost') != -1;
var port = isDev ? "9090" : "8080";
var geoipHost = isDev ? localDevServer : "http://freegeoip";
var geoipUrl = geoipHost + ":" + port + "/json/";
getLocationFromGeoIPServer = function (ip) {
    var urlToCheck = geoipUrl + ip;
    try {
        var getLocationSync = Meteor.wrapAsync(ScienceXML.getLocationAsync);
        var result = getLocationSync(urlToCheck);
        if (!result)return;
        return EJSON.parse(result);
    } catch (err) {
        logger.warning("connection to geoip failed at: " + geoipUrl);
    }


}
getLocationFromLocalDatabase = function (ip) {
    var currentUserIPNumber = Science.ipToNumber(ip);
    var result = IP2Country.findOne({
        startIpLong: {$lte: currentUserIPNumber},
        endIpLong: {$gte: currentUserIPNumber}
    });
    if (!result)return;
    return {
        ip: ip,
        country_code: result.countryCode2,
        country_name: result.country.en,
        country_chinese_name: result.country.cn,
        region_name: result.province.en,
        region_chinese_name: result.province.cn
    }
}

getLocationByIP = function (ip) {
    if (Meteor.isDevelopment) {
        //pretend to be baidu in dev mode because of internal office ip not resolving correctly
        ip = "180.149.132.47"; //180.149.132.47 = baidu.com
    }
    if(_.isString(ip) && ip.startWith("192.168")){//内网ip推定为国内
        return {country_code:"CN"};
    }
    var result = getLocationFromGeoIPServer(ip);
    if (!result)
        result = getLocationFromLocalDatabase(ip);
    if (!result)return;
    return result;
}