Router.configure({
    templateNameConverter: "upperCamelCase",
    routeControllerNameConverter: "upperCamelCase",
    layoutTemplate: "layout",
    notFoundTemplate: "notFound",
    loadingTemplate: "loading",
    progressDelay: 100,
    progressSpinner: false
});
HomePageSubs = new SubsManager();
CollectionSubs = new SubsManager();
MiniPlatformSubs = new SubsManager();
JournalSubs = new SubsManager();
ArticleSubs = new SubsManager();

HomePageSubs.subscribe("current_user_data");
Meteor.subscribe('pages');
HomePageSubs.subscribe('images');
Meteor.subscribe('advertisement');
HomePageSubs.subscribe('institutions');
HomePageSubs.subscribe('searchHistory');
HomePageSubs.subscribe('emailConfig');
HomePageSubs.subscribe('publishers');
HomePageSubs.subscribe('publications');
HomePageSubs.subscribe('tag');
HomePageSubs.subscribe('news');

Router.onBeforeAction(function () {
    // loading indicator here
    if (!this.ready()) {
        $("body").addClass("wait");
    } else {
        $("body").removeClass("wait");
        this.next();
    }
});
Router.route("home", {
    path: "/",
    controller: "HomePrivateController",
    title: function () {
        return TAPi18n.__("Home");
    },
    waitOn: function () {
        return [
            HomePageSubs.subscribe('publishers'),
            HomePageSubs.subscribe('images'),
            HomePageSubs.subscribe('news'),
            HomePageSubs.subscribe('homepageMostRecentArticles'),
            HomePageSubs.subscribe('mostCited'),
            Meteor.subscribe('homepageMostReadBrief')
        ]
    },
    onStop:function(){
        Science.dom.clearSelect2Record();
    }
});

Router.route("/topics/", {
    parent: "home",
    name: "topics",
    template:"Topics",
    title: function () {
        return TAPi18n.__("Topics");
    },
    waitOn: function () {
        return [
            Meteor.subscribe('topics')
        ]
    },
    onBeforeAction: function () {
        Session.set('PerPage', 10);
        Session.set('journalId', undefined);
        this.next();
    }
});

Router.route("topics/:topicsId/", {
    template      : "topicsDetail",
    name          : "topics.selectArticles",
    parent        : "topics",
    title: function () {
        return TAPi18n.__("addArticleToCollection");
    },
    waitOn: function () {
        return [
            Meteor.subscribe('topics'),
            Meteor.subscribe('articlesInTopic',this.params.topicsId)
        ]
    }
});

Router.map(function () {


    this.route("publishers", {
        parent: "home",
        title: function () {
            return TAPi18n.__("Publishers");
        },
        waitOn: function () {
            return [
                HomePageSubs.subscribe('images'),
                HomePageSubs.subscribe('publishers')
            ]
        }
    });

    this.route("publications", {
        parent: "home",
        title: function () {
            return TAPi18n.__("Publications");
        },
        waitOn: function () {
            return [
                HomePageSubs.subscribe('images'),
                HomePageSubs.subscribe('publishers'),
                HomePageSubs.subscribe('publications')
            ]
        }
    });

    this.route('/publisher/:publisherName', {
        data: function () {
            var pub = Publishers.findOne({shortname: this.params.publisherName});
            if (pub) {
                Session.set('currentPublisherId', pub._id);
                Session.set('filterPublisher', pub._id);
                return pub;
            }
        },
        template: "ShowPublisher",
        parent: "publishers",
        title: function () {
            var p = Publishers.findOne({shortname: this.params.publisherName})
            if(!p)return this.params.publisherName;
            if (TAPi18n.getLanguage() === "en")return p.name || p.chinesename;
            return p.chinesename || p.name;
        },
        name: "publisher.name",
        waitOn: function () {
            return [
                HomePageSubs.subscribe('images'),
                HomePageSubs.subscribe('publishers'),
                HomePageSubs.subscribe('publications'),
                CollectionSubs.subscribe('allCollections'),
                HomePageSubs.subscribe('topics'),
                HomePageSubs.subscribe('tag')
            ]
        }
    });

    this.route('cooperationCenter', {
        template: "cooperationCenter",
        parent: "home",
        name: "cooperationCenter",
        title: function () {
            return TAPi18n.__("Ad Center");
        },
        waitOn: function () {
            return [
                HomePageSubs.subscribe('images'),
                JournalSubs.subscribe('files'),
                HomePageSubs.subscribe('publishers'),
                HomePageSubs.subscribe('publications'),
                JournalSubs.subscribe("journal_ad")
            ]
        }
    });


    this.route('mostReadArticles', {
        template: "mostReadArticle",
        title: function () {
            return TAPi18n.__("Most read articles");
        },
        parent: "home",
        name: "mostRead.show",
        waitOn: function () {
            return [
                Meteor.subscribe('homepageMostRead')
            ]
        }
    });

    this.route('mostReadArticles/:journalId', {
        template: "mostReadArticle",
        title: function () {
            return TAPi18n.__("Most read articles");
        },
        parent: "home",
        name: "mostRead.showWithJournalId",
        waitOn: function () {
            return [
                Meteor.subscribe('journalMostRead',this.params.journalId)
            ]
        }
    });

    this.route('/mostCitedArticles', {
        template: "mostCiteArticle",
        title: function () {
            return TAPi18n.__("Most cited");
        },
        parent: "home",
        name: "mostCite.show",
        waitOn: function () {
            return [
                HomePageSubs.subscribe('mostCited')
            ]
        }
    });

    this.route('/mostCitedArticles/:journalId', {
        template: "mostCiteArticle",
        title: function () {
            return TAPi18n.__("Most cited");
        },
        parent: "home",
        name: "mostCite.showWithJournalId",
        waitOn: function () {
            return [
                Meteor.subscribe('mostCited',this.params.journalId)
            ]
        }
    });

    this.route('mostEditorRecommend/:journalId', {
        template: "mostRecommendArticles",
        title: function () {
            return TAPi18n.__("Editors Recommend");
        },
        parent: "home",
        name: "mostEditor.show",
        waitOn: function () {
            return [
                Meteor.subscribe('editorRecommends', this.params.journalId)
            ]
        }
    });

    this.route("advancedSearch", {
        parent: "home",
        title: function () {
            return TAPi18n.__("Advanced Search");
        },
        waitOn: function () {
            return [
                HomePageSubs.subscribe('publications'),
                HomePageSubs.subscribe('publishers'),
                Meteor.subscribe('topics')
            ]
        }
    });


    this.route('/news/:newsId', {
        template: "showNewsArticle",
        title: function () {
            return TAPi18n.__("News");
        },
        parent: "home",
        name: "news.show",
        waitOn: function () {
            return [
                JournalSubs.subscribe('files'),
                HomePageSubs.subscribe('news')
            ]
        }
    });

    this.route('/publisher/account/:pubId', {
        template: "PublisherPanel",
        name: "publisher.account",
        parent: "home",
        yieldTemplates: {
            'publisherAccountTemplate': {to: 'PublisherSubcontent'}
        },
        title: function () {
            return TAPi18n.__("Publisher");
        },
        waitOn: function () {
            Session.set("activeTab", "publisher");
            return [
                HomePageSubs.subscribe('publishers')
            ]
        },
        onBeforeAction: function () {
            Permissions.check("use-publisher-panel", "platform",{publisher:this.params.pubId});
            /*BEFORE_FUNCTION*/
            this.next();
        },
        data: function () {
            return {
                scope: {publisher: [this.params.pubId]}
            };
        }
    });

    this.route("/publisher/account/insert/:pubId", {
        template: "PublisherPanel",
        name: "publisher.account.insert",
        parent: "publisher.account",
        yieldTemplates: {
            'AdminUsersInsert': {to: 'PublisherSubcontent'}
        },
        title: function () {
            return TAPi18n.__("Add new user");
        },
        waitOn: function () {
            Session.set("activeTab", "publisher");
            return [
                HomePageSubs.subscribe('publishers')
            ]
        },

        onBeforeAction: function () {
            Permissions.check("add-user", "user",{publisher:this.params.pubId});
            this.next();
        }
    });

    this.route("/publisher/account/edit/:userId", {
        template: "PublisherPanel",
        name: "publisher.account.edit",
        parent: "publisher.account",
        yieldTemplates: {
            'AdminUsersEdit': {to: 'PublisherSubcontent'}
        },
        title: function () {
            return TAPi18n.__("Edit user");
        },
        waitOn: function () {
            Session.set("activeTab", "publisher");
            return [
                HomePageSubs.subscribe('publishers')
            ]
        },
        onBeforeAction: function() {
            var scope = {};
            var user = Users.findOne({_id:this.params.userId},{fields:{publisherId:1,institutionId:1}});
            if(user.publisherId)
                scope.publisher=user.publisherId;
            if(user.institutionId)
                scope.institution=user.institutionId;
            if (!Permissions.userCan("modify-user","user",Meteor.userId(),scope))
                Router.go('home');
            this.next();
        },
        data: function() {
            var result =  {
                params: this.params || {},
                currUser: Users.findOne({_id:this.params.userId}, {})
            };
            var urs = Permissions.getUserRoles();
            var publisherManagerOne = _.find(urs,function(ur){
                return ur.role == 'publisher:publisher-manager-from-user';
            });
            if(publisherManagerOne && publisherManagerOne.scope){
                result.publisherScope = publisherManagerOne.scope.publisher;
            }
            return result;
        }
    });

    this.route("/publisherPanel/:pubId", {
        name:"publisherPanel",
        controller: "publisherPanelController",
        parent: "home",
        title: function () {
            return TAPi18n.__("Publisher");
        }
    });

    this.route("/publisher/upload/:pubId", {
        template: "PublisherPanel",
        name: "publisher.upload",
        parent: "publisherPanel",
        yieldTemplates: {
            'AdminUpload': {to: 'PublisherSubcontent'}
        },
        title: function () {
            return TAPi18n.__("Upload");
        },
        waitOn: function () {
            return [
                Meteor.subscribe('uploadPage')
                //Meteor.subscribe('publishers')
            ]
        }
        //onBeforeAction: function () {
        //    Permissions.check("add-user", "user",{publisher:this.params.pubId});
        //    this.next();
        //}
    });

    //this.route("testTemplate", {
    //    path: "/testTemplate"
    //});
    //this.route("editseaTemp", {
    //    path: "/editseaTemp"
    //});
    //this.route("searchResult", {
    //    path: "/searchResult"
    //});
    //this.route("loginNew", {
    //    path: "/loginNew"
    //});
    //this.route("userAgreement", {
    //    path: "/userAgreement"
    //});
    //this.route("publishCont", {
    //    path: "/publishCont"
    //});
    //this.route("publishRecommed", {
    //    path: "/publishRecommed"
    //});
    //this.route("publishAuthor", {
    //    path: "/publishAuthor"
    //});
    //this.route("personal1", {
    //    path: "/personal1"
    //});
    //this.route("news", {
    //    path: "/news"
    //});
    //this.route("edit_author", {
    //    path: "/edit_author"
    //});
});
