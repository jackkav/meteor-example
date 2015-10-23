Template.sidebarAd.helpers({
    whichLink: function () {
        if (this.endDate.format("yyyy-MM-dd") >= new Date().format("yyyy-MM-dd")) return this.link;
        return this.defaultLink;
    },
    whichPictures: function () {
        if (this.endDate.format("yyyy-MM-dd") >= new Date().format("yyyy-MM-dd")) return this.pictures;
        return this.defaultPictures;
    },
    advertisement: function () {
        //判断当前路径是不是期刊或者期刊下属的页面
        var isJournalPage = _.contains(Config.ADPages.journal, Router.current().route.getName());
        var type = isJournalPage ? "2" : "1";
        var query = {types: type};
        if (isJournalPage) {
            query.publications = Session.get('currentJournalId');
        }
        return Advertisement.find(query);
    },
    isADPage: function () {
        if (!Router.current().route)return false;
        return _.contains(Config.ADPages.global, Router.current().route.getName())
            || _.contains(Config.ADPages.journal, Router.current().route.getName());
    },
    AdCount: function () {
        if (!Router.current().route)return 0;
        var isJournalPage = _.contains(Config.ADPages.journal, Router.current().route.getName());
        var type = isJournalPage ? "2" : "1";
        var query = {types: type};
        if (isJournalPage) {
            query.publications = Session.get('currentJournalId');
        }
        if (4 < Advertisement.find(query).count()) {
            return false;
        }
        return true;
    }
});

Template.sidebarAd.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e, function () {
            Advertisement.remove({_id: id});
        })
    }
});

AutoForm.addHooks(['addAdvertisementModalForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            var isJournalPage = _.contains(Config.ADPages.journal, Router.current().route.getName());
            var type = isJournalPage ? 2 : 1;
            doc.types = type;
            doc.publications = Session.get('currentJournalId');
            return doc;
        }
    }
}, true);