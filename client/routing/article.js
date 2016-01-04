Router.route('/publisher/:publisherName/journal/:journalShortTitle/:volume/:issue/:publisherDoi/:articleDoi', {
    data: function () {
        var pub = Publishers.findOne({shortname: this.params.publisherName});
        var journal = Publications.findOne({shortTitle: this.params.journalShortTitle});
        Session.set("activeTab", "full text");
        if (pub) {
            journal && Session.set('currentJournalId', journal._id);
            pub && Session.set('currentPublisherId', pub._id);
            Session.set('currentDoi', this.params.publisherDoi + "/" + this.params.articleDoi);
            return Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi});
        }
    },
    template: "showArticle",
    title: function () {
        return TAPi18n.__("Article");
    },
    parent: "journal.name.toc",
    name: "article.show",
    waitOn: function () {
        var artData = this.data();
        var artId;
        if (artData)artId = artData._id;
        return [
            Meteor.subscribe('oneIssueArticlesByArticleId', artId),
            Meteor.subscribe('oneJournalIssues', Session.get('currentJournalId')),
            Meteor.subscribe('oneArticleByDoi', Session.get('currentDoi')),
            Meteor.subscribe('oneArticleKeywords', Session.get('currentDoi')),
            Meteor.subscribe('oneArticleFigures', Session.get('currentDoi')),
            Meteor.subscribe('pdfs'),
            Meteor.subscribe('medias'),
            Meteor.subscribe('files'),
            Meteor.subscribe('mostRead', Session.get('currentJournalId'), 5),
            Meteor.subscribe('mostCited', Session.get('currentJournalId'), 5)
        ]
    },
    onBeforeAction: function () {
        if (!Session.get("ipInChina")) {
            Meteor.call("getLocationByCurrentIP", function (err, result) {
                if (!result)console.log("ip not found.");
                else {
                    console.log("Your location has been detected as: " + JSON.stringify(result));//result.country_name ? result.country_name : result);//"No country found!");
                    Session.set("ipInChina", result.country_code === "CN");
                }
            })
        }
        if (!_.isEmpty(this.data().affiliations) && this.data().affiliations.length == 1) {
            Session.set("hideAffLabel", true);
        } else {
            Session.set("hideAffLabel", false);
        }

        if(!Science.Cookies.get('mjx.menu')){
            Science.Cookies.set('mjx.menu',"renderer:PreviewHTML")
        }
        this.next();
    },
    onStop: function () {
        Meteor.clearInterval(Session.get("dynamicRender"));
    }
});

Router.route('/doi/:publisherDoi/:articleDoi', function () {
    var article = Articles.findOne(
        {doi: this.params.publisherDoi + "/" + this.params.articleDoi},
        {fields: {
            journalId: 1,
            publisher: 1,
            volume: 1,
            issue: 1
        }}
    );
    if (article) {
        var journal = Publications.findOne({_id: article.journalId}, {fields: {shortTitle: 1}});
        var pub = Publishers.findOne({_id: article.publisher}, {fields: {shortname: 1}});
    }
    this.redirect('article.show', {
        publisherName: pub.shortname,
        journalShortTitle: journal.shortTitle,
        volume: article.volume,
        issue: article.issue,
        publisherDoi: this.params.publisherDoi,
        articleDoi: this.params.articleDoi
    });
}, {
    waitOn: function () {
        return [
            Meteor.subscribe('oneArticleByDoi', this.params.publisherDoi + "/" + this.params.articleDoi),
            Meteor.subscribe('medias'),
            Meteor.subscribe('files')
        ]
    }
});