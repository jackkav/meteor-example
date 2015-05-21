this.Publishers = new Meteor.Collection("publishers");
this.Publishers.attachSchema(new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 10
    },
    description: {
        type: String,
        label: "Name",
        max: 10
    }
}
));
this.Publishers.userCanInsert = function(userId, doc) {
    return true;
}

this.Publishers.userCanUpdate = function(userId, doc) {
    return true;
}

this.Publishers.userCanRemove = function(userId, doc) {
    return true;
}
