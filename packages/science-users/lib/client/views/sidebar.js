Template.LayoutSideBar.helpers({
    institutionLogo: function () {
        var currentUserIPNumber = Session.get("currentUserIPNumber");
        if (currentUserIPNumber === undefined) {
            Meteor.call("getClientIP", function (err, ip) {
                currentUserIPNumber = Science.ipToNumber(ip);
                Session.set("currentUserIPNumber", currentUserIPNumber);
            });
        }
        var logo = undefined;
        var institutuion = Institutions.findOne({ipRange: {$elemMatch: {startNum: {$lte: currentUserIPNumber}, endNum: {$gte: currentUserIPNumber}}}});
        if (institutuion) {
            logo = Images && institutuion.logo && Images.findOne({_id: institutuion.logo}).url();
        }
        if (logo) return '<img src="' + logo + '" width="100%" height="auto"/>';
        else return;
    },
    canUseAdminPanel: function () {
        return !!Permissions.getUserRoles().length;
    },
    isArticlePage: function () {
        return Router.current().route.getName()=="article.show";
    },
    isJourmalPage: function () {
        return Router.current().route.getName()=="journal.name";
    },
    favoriteName: function(){
        var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
        var article = Articles.findOne({doi: currentDoi});
        if(Meteor.userId()){
            var fav = Meteor.user().favorite || [];
            var existObj =_.find(fav,function(obj){
                return obj.articleId == article._id;
            });
            return existObj?TAPi18n.__("Favorited"):TAPi18n.__("Favorite");

        }
    },
    watchArticleName: function(){
        var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
        var article = Articles.findOne({doi: currentDoi});
        if(Meteor.userId() && article){
            var wat = Meteor.user().watchArticle || [];
            return _.contains(wat, article._id)?TAPi18n.__("Watched"):TAPi18n.__("Article Watch");
        }else{
            return TAPi18n.__("Article Watch");
        }
    },
    watchName: function(){
        var currentTitle = Router.current().params.journalTitle;
        var journal = Publications.findOne({title: currentTitle});
        if(Meteor.userId() && journal){
            var wat = Meteor.user().watch || [];
            return _.contains(wat, journal._id)?TAPi18n.__("Watched"):TAPi18n.__("Journal Watch");
        }else{
            return TAPi18n.__("Journal Watch");
        }
    }
});

Template.LayoutSideBar.events({
    "click .favorite": function(){
        var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
        var article = Articles.findOne({doi: currentDoi});
        if(Meteor.userId()){
            var fav = Meteor.user().favorite || [];
            var existObj =_.find(fav,function(obj){
                return obj.articleId == article._id;
            });
            if(existObj){
                fav = _.without(fav, existObj)
            }else{
                fav.push({articleId:article._id,createOn:new Date()})
            }
            Users.update({_id: Meteor.userId()},{$set:{favorite: fav}});
        }
    },
    "click .watchArticle": function(){
        var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
        var article = Articles.findOne({doi: currentDoi});
        if(Meteor.userId()){
            var wat = Meteor.user().watchArticle || [];
            if(_.contains(wat, article._id)){
                wat = _.without(wat, article._id)
            }else{
                wat.push(article._id)
            }
            Users.update({_id: Meteor.userId()},{$set:{watchArticle: wat}});
        }
    },
    "click .watch": function(){
        var currentTitle = Router.current().params.journalTitle;
        var journal = Publications.findOne({title: currentTitle});
        if(Meteor.userId()){
            var wat = Meteor.user().watch || [];
            if(_.contains(wat, journal._id)){
                wat = _.without(wat, journal._id)
            }else{
                wat.push(journal._id)
            }
            Users.update({_id: Meteor.userId()},{$set:{watch: wat}});
        }else{
            swal({
                    title: "",
                    text: TAPi18n.__("Please enter the receiving mailbox"),
                    type: "input",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    animation: "slide-from-top",
                    inputPlaceholder: "Write something",
                    cancelButtonText  : TAPi18n.__("Cancel"),
                    confirmButtonText : TAPi18n.__("OK")
                },
                function(inputValue){
                    if (inputValue === false) return false;

                    if (inputValue === "") {
                        swal.showInputError(TAPi18n.__("You need to enter email address!"));
                        return false
                    }
                    swal(TAPi18n.__("Success"));
                });
        }
}
})