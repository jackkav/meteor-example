this.Publications = new Meteor.Collection("publications");

PublicationsSchema  = new SimpleSchema({
    title: {
        type: String,
        unique: true
    },
    chinesetitle: {
        type: String,
        unique: true
    },
    urlname: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        optional: true,
        autoform: {
            rows: 2
        }
    },
    chinesedescription: {
        type: String,
        optional: true,
        autoform: {
            rows: 2
        }
    },
    firstletter:{
        type: String,
        max: 1
    },
    chinesefirstletter:{
        type: String,
        max: 1
    },
    accessKey: {
      type: String,
    }
});
Meteor.startup(function() {
    PublicationsSchema .i18n("schemas.publications");
    Publications.attachSchema(PublicationsSchema);
});

this.Publications.userCanInsert = function(userId, doc) {
	return true;
}

this.Publications.userCanUpdate = function(userId, doc) {
	return true;
}

this.Publications.userCanRemove = function(userId, doc) {
	return true;
}
