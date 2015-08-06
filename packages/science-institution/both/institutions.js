this.Institutions = new Meteor.Collection("institutions");

Institutions.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-institution", "institution", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-institution", "institution", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-institution", "institution", userId);
    }
});

InstitutionsSchema = new SimpleSchema({
    name: {
        type: String
        //unique: true
    },
    logo: {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images',
                accept: 'image/gif,image/jpeg,image/png,.gif,.jpeg,.jpg,.png'
            }
        }
    },
    ipRange: {
        type: [Object],
        minCount: 1
    },
    "ipRange.$.startIP": {
        type: String,
        regEx: SimpleSchema.RegEx.IPv4
    },
    "ipRange.$.endIP": {
        type: String,
        regEx: SimpleSchema.RegEx.IPv4
    },
    "ipRange.$.startNum": {
        type: Number,
        max: 4294967295,
        min: 0
    },
    "ipRange.$.endNum": {
        type: Number,
        max: 4294967295,
        min: 0
    }
});
Meteor.startup(function () {
    InstitutionsSchema.i18n("schemas.institutions");
    Institutions.attachSchema(InstitutionsSchema);
});