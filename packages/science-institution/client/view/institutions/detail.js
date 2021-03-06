ReactiveTabs.createInterface({
    template: 'institutionTabs',
    onChange: function (slug) {
        if(slug !== Session.get('activeTab'))
            Session.set('activeTab', slug);
    }
});

Template.showInstitution.helpers({
    "getInstitutionNameById": function () {
        if(Router.current().params.insId)
            var i = Institutions.findOne({_id: Router.current().params.insId});
        if(i)return i.name;
    },
    displayOption: function () {
        return Router.current().route.getName() === "admin.institutions.detail";
    },
    info: function () {
        var obj = Institutions.findOne({_id: Router.current().params.insId});
        if(!obj)return;
        obj.scope =  this.scope;
        return obj;
    }
});

Template.institutionOptions.helpers({
    tabs: function () {
        return [
            {name: TAPi18n.__("Institution Detail"), slug: 'detail'},
            {name: TAPi18n.__("Institution Account"), slug: 'account'}
        ];
    },
    activeTab: function () {
        return Session.get('activeTab');
    },
    info: function () {
        var obj = Institutions.findOne({_id: Router.current().params.insId});
        obj.scope = {institution: obj._id};
        return obj;
    },
    getUsers: function () {
        return Users.find({institutionId: Router.current().params.insId}, {});
    },
    getScope:function(){
        return {institutionId:Router.current().params.insId};
    }
});

Template.institutionDetail.helpers({
    getType: function (type) {
        switch (type) {
            case "1":
                return TAPi18n.__("Librarian");
            case "2":
                return TAPi18n.__("Publisher");
            case "3":
                return TAPi18n.__("Editorial Board");
            case "4":
                return TAPi18n.__("University");
            case "5":
                return TAPi18n.__("Research Institution");
            case "6":
                return TAPi18n.__("Others");
        }
    }
})