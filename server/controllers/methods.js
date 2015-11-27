getMostReadByJournal = function (journalId, limit) {
    if (!limit)limit = 20;
    var a = undefined;
    if (journalId)
        a = PageViews.aggregate([{
            $match: {
                journalId: journalId
            }
        }, {
            $group: {
                _id: {articleId: '$articleId'},
                count: {$sum: 1}
            }
        }, {$sort: {count: -1}}
            , {$limit: limit}]);
    else a = PageViews.aggregate([{
        $group: {
            _id: {articleId: '$articleId'},
            count: {$sum: 1}
        }
    }, {$sort: {count: -1}}
        , {$limit: limit}]);
    if (!a)return;
    return a;
}
getMostReadSuggestion = function (currentJournalId) {
    //add suggestion if journalId not set or its journalId equals current
    var suggestedArticle = SuggestedArticles.findOne();
    if (!suggestedArticle)return;
    var article = Articles.findOne({_id: suggestedArticle.articleId});
    if (!article) return;
    if (!currentJournalId) return article;
    if (article.journalId !== currentJournalId) return;
    return article;
}
createMostReadList = function (journalId, limit) {
    var allIds = [];
    //get the most read object by grouping articleviews
    var most = getMostReadByJournal(journalId, limit);
    if (!most)return [];
    //get the suggestion
    var suggestion = getMostReadSuggestion(journalId);
    //add suggestion to top of list
    if (suggestion) {
        allIds.push(suggestion._id);
    }
    _.each(most, function (item) {
        allIds.push(item._id.articleId);
    });
    return _.uniq(allIds); //This removes any duplicates after initial
}
//TODO: move to config
var localDevServer = process.env.DOCKER_URL ? process.env.DOCKER_URL : "http://192.168.1.10"
var isDev = process.env.ROOT_URL.indexOf('localhost') != -1;
var port = isDev ? "9090" : "8080";
var geoipHost = isDev ? localDevServer : "http://freegeoip";
var geoipUrl = geoipHost + ":" + port + "/json/";
getMyLocationFromGeoIPServer = function (ip) {
    var urlToCheck = geoipUrl + ip;
    if (Meteor.isDevelopment) {
        //pretend to be baidu in dev mode because of internal office ip not resolving correctly
        urlToCheck = geoipUrl + "baidu.com";
    }
    try {
        var getLocationSync = Meteor.wrapAsync(ScienceXML.getLocationAsync);
        var result = getLocationSync(urlToCheck);
        if (!result)return;
        return EJSON.parse(result);
    } catch (err) {
        logger.error("connection failed to geoip at: " + geoipUrl);
    }


}
getMyLocationFromLocalDatabase = function (ip) {
    var currentUserIPNumber = Science.ipToNumber(ip);
    var result = IP2Country.findOne({
        startIpLong: {$lte: currentUserIPNumber},
        endIpLong: {$gte: currentUserIPNumber}
    });
    if (!result)return;
    return {ip: currentIP, country_code: result.countryCode2, country_name: result.country.en}
}

Meteor.methods({
    'distinctVolume': function (journalId) {
        var result = Issues.distinct("volume", {"journalId": journalId});
        console.dir(result);
        return result;
    },
    'getClientIP': function () {
        return this.connection.httpHeaders['x-forwarded-for'] || this.connection.clientAddress;
    },
    'getMostRead': function (journalId, limit) {
        return createMostReadList(journalId, limit);
    },
    'countSession': function () {
        return UserStatus.connections.find().count();
    },
    'totalArticles': function () {
        return Articles.find().count();
    },
    'getLocationByCurrentIP': function () {
        var ip = this.connection.httpHeaders['x-forwarded-for'] || this.connection.clientAddress;
        var result = getMyLocationFromGeoIPServer(ip);
        if (!result)
            result = getMyLocationFromLocalDatabase(ip);

        if (!result)return;
        return result;
    },
    'getLocationReport': function (action, articleId) {
        var countryViews = {};
        var other = {name: {cn: '其他', en: 'Others'}, locationCount: 0};
        PageViews.aggregate([{
            $group: {
                _id: {articleId: articleId, action: action, ip: '$ip'},
                count: {$sum: 1}
            }
        }]).forEach(function (item) {
            if (!item._id.ip) {
                other.locationCount += item.count;
            } else {
                var currentUserIPNumber = Science.ipToNumber(item._id.ip)
                var country = IP2Country.findOne({
                        startIpLong: {$lte: currentUserIPNumber},
                        endIpLong: {$gte: currentUserIPNumber}
                    },
                    {fields: {country: 1, countryCode2: 1}}
                );
                if (country) {
                    if (countryViews[country.countryCode2]) {
                        countryViews[country.countryCode2].locationCount += item.count;
                    } else {
                        countryViews[country.countryCode2] = {name: country.country, locationCount: item.count}
                    }
                } else {
                    other.locationCount += item.count;
                }
            }
        });
        countryViews = _.values(countryViews);
        if (other.locationCount > 0)
            countryViews.push(other);
        return countryViews;
    },
    'updateKeywordScore': function (keywords, score) {
        if (_.isEmpty(keywords))
            return;
        var arr = (typeof keywords === 'string') ? [keywords] : keywords;
        var sc = score || 1;

        Keywords.update({name: {$in: arr}}, {$inc: {"score": sc}}, {multi: true});
        return true;
    }
});
