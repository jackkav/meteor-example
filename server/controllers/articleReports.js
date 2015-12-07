getArticlePageLocationReport = function (action, articleId) {
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
}
getArticlePageViewsGraphData = function (articleId) {
    var currentDate = new Date;
    var a = new Array();
    var f = new Array();
    var c = new Array();
    var m = [];
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (var i = 1; i <= 12; i++) {
        var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        a.unshift(PageViews.find({
            action: "abstract",
            articleId: articleId,
            when: {$gte: startDate, $lt: endDate}
        }).count());
        f.unshift(PageViews.find({
            action: "fulltext",
            articleId: articleId,
            when: {$gte: startDate, $lt: endDate}
        }).count());
        m.unshift(month[currentDate.getMonth() % 12] + currentDate.getFullYear());
        currentDate.setMonth(currentDate.getMonth() - 1);
    }

    _.each(a, function (index, el) {
        var value = el + f[index];
        c.push(value);
    });
    var result = {abstract: a, fulltext: f, total: c, months: m};
    return result;
}