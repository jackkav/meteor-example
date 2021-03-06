this.News = new Meteor.Collection("news");

this.News.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-news", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-news", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-news", "resource", userId);
    }
});

NewsSchema = new SimpleSchema({
    title: {
        type: Science.schemas.MultipleTextOptionalSchema
    },
    createDate: {
        type: Date,
        optional: true
    },
    author: {
        type: Science.schemas.MultipleTextOptionalSchema,
        optional: true
    },
    abstract: {
        type: Science.schemas.MultipleAreaSchema,
        optional: true
    },
    content: {
        type:Science.schemas.MultipleTextAreaSchema,
        optional: true
    },
    url: {
        type: String,
        optional: true
    },
    picture: {
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
    types: {
        type: String,
        optional: true
    },
    fileId: {
        type: String,
        optional: true,
        autoform: {
            type: "cfs-file",
            collection: "files"
        }
    },
    releaseTime: {
        type: Date,
        optional: true,
        autoform: {
            afFieldInput: {
                type: "bootstrap-datepicker"
            }
        }
    },
    about: {
        type: String,
        optional: true
    },
    publications: {
        type: String,
        optional: true
    },
    pageView: {
        type:Number,
        defaultValue: 0,
        optional: true
    }
});
Meteor.startup(function () {
    NewsSchema.i18n("schemas.news");
    News.attachSchema(NewsSchema);
});

if (Meteor.isClient) {
    newsContentPaginator = new Paginator(News);
    pubDynamicPaginator = new Paginator(News);
}
