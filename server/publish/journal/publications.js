Meteor.publish('publications', function() {
    //if(Permissions.userCan("modify-journal", "resource",this.userId)){
    //    return Publications.find({}, {sort: ['name']});
    //}
    return Publications.find({}, {sort: ['name']});
});
