var urlToArticleByArticleObject = function (article) {
    return getJournalComponentByArticle(article) + getIssueComponentByArticle(article) + "/" + article.doi;
}
var getJournalComponentByArticle = function (article) {
    var publisherName = Publishers.findOne({_id: article.publisher}).name;
    var journalName = Publications.findOne({_id: article.journalId}).title;
    return "/publisher/" + publisherName + "/journal/" + journalName;
}
var getIssueComponentByArticle = function (article) {
    var issue = Issues.findOne({_id: article.issueId});
    return "/" + issue.volume + "/" + issue.issue;
}

Template.registerHelper('urlToArticle', function (title) {
    var article = Articles.findOne({title: title});
    return urlToArticleByArticleObject(article);
});

Template.registerHelper('urlToArticleById', function (id) {
    var article = Articles.findOne({_id: id});
    return urlToArticleByArticleObject(article);
});

Template.registerHelper('urlToTOC', function (title) {
    var article = Articles.findOne({title: title});
    return getJournalComponentByArticle(article) + getIssueComponentByArticle(article);
});

Template.registerHelper('urlToJournal', function (title) {
    var article = Articles.findOne({title: title});
    return getJournalComponentByArticle(article);
});


Template.registerHelper('getImageHelper', function (pictureId) {
    var noPicture = "http://sbiapps.sitesell.com/sitebuilder/sitedesigner/resource/basic_white_nce/image-files/thumbnail1.jpg";
    return (Images && pictureId && Images.findOne({_id: pictureId}).url()) || noPicture;
});

Template.registerHelper('isChinese', function (language) {
    if (language === "zh-CN")
        return true;
    return false;
});

Template.registerHelper('translateThis', function (chinese, english) {
    if (TAPi18n.getLanguage() === "zh-CN")
        return chinese;
    return english;
});

Template.registerHelper('getCreateButtonContent', function () {
    return TAPi18n.__("Create");
});

Template.registerHelper('getUpdateButtonContent', function () {
    return TAPi18n.__("Update");
});

Template.registerHelper('getDeleteButtonContent', function () {
    return TAPi18n.__("Delete");
});

pluralize = function (n, thing, options) {
    var plural = thing;
    if (_.isUndefined(n)) {
        return thing;
    } else if (n !== 1) {
        if (thing.slice(-1) === 's')
            plural = thing + 'es';
        else
            plural = thing + 's';
    }

    if (options && options.hash && options.hash.wordOnly)
        return plural;
    else
        return n + ' ' + plural;
}

Template.registerHelper('pluralize', pluralize);


Template.registerHelper('clearStr', function (str) {
    str = str.replace(/(<\/?[^>]+?>|\.)/g, '');
    return str.replace(/\s/g, '-');
});

Template.registerHelper("highlight", function (keyword, str) {
    return str.split(keyword).join("<span class='highlight'>" + keyword + "</span>")
});
