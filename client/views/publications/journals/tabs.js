ReactiveTabs.createInterface({
    template: 'addArticleToSpecialTopicsTabs',
    onChange: function (slug, template) {
    }
});

Template.addArticleToSpecialTopicsTabsTemp.helpers({
    tabs: function () {
        return [
            {name: TAPi18n.__("add article"), slug: 'add'},
            {name: TAPi18n.__("added articles"), slug: 'inside'}
        ]
    },
    activeTab: function () {
        return Session.get('activeTab');
    }
});
