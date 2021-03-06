ReactiveTabs.createInterface({
	template: 'accountTabs',
	onChange: function (slug) {
		history.replaceState({},document.title,window.location.pathname + "?slug="+slug);
		//if (slug === 'normal') {
		//	Meteor.subscribe("usersPageType", "normal");
		//} else if (slug === 'publisher') {
		//	Meteor.subscribe("usersPageType", "publisher");
		//} else if (slug === 'institution') {
		//	Meteor.subscribe("usersPageType", "institution");
		//}
	}
});


Template.accountOptions.helpers({
	tabs: function () {
		return [
			{name: TAPi18n.__("Admin"), slug: 'admin'},
			{name: TAPi18n.__("Normal User"), slug: 'normal'},
			{name: TAPi18n.__("Publisher"), slug: 'publisher'},
			{name: TAPi18n.__("Institutional Users"), slug: 'institution'}
		];
	},
	activeTab: function () {
		return Session.get('activeTab');
	}
});