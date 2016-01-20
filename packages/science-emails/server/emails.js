Meteor.methods({
    sendEmail: function (to, from, subject, text) {
        check([to, from, subject, text], [String]);

        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();

        Email.send({
            to: to,
            from: from,
            subject: subject,
            text: text
        });
    },
    sendHtmlEmail: function (to, from, subject, html) {
        check([to, from, subject, html], [String]);

        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();

        Email.send({
            to: to,
            from: from,
            subject: subject,
            html: html
        });
    },
    emailThis: function (values) {
        if (!Meteor.user())return;
        if (!Meteor.user().emails[0])return;
        if (!Meteor.user().emails[0].address)return;

        var user = Meteor.user().emails[0].address;
        if (Meteor.user().profile)
            if (Meteor.user().profile.realName)
                user = Meteor.user().profile.realName;

        if (values.reasons === undefined)values.reasons = "";

        var article = Articles.findOne({
            doi: values.doi
        }, {
            fields: {_id: 1, title: 1, authors: 1, year: 1, volume: 1, issue: 1, elocationId: 1, journalId: 1, 'journal.titleCn': 1}
        });
        article.url = values.url;
        if(!article.journal) article.journal = {};
        article.journal.url = Meteor.absoluteUrl(Science.URL.journalDetail(article.journalId).substring(1));

        var emailSubject = user + ' has sent you an article';

        Meteor.defer(function () {
            Email.send({
                to: values.recipient,
                from: Config.mailServer.address,
                subject: emailSubject,
                html: JET.render('emailThis', {
                    "user": user,
                    "reason": values.reasons,
                    "articleList": [article],
                    "scpLogoUrl": Config.rootUrl + "email/logo.png",
                    "rootUrl": Config.rootUrl
                })
            });
        });

    },
    broadcastEmail: function (values) {
        Meteor.defer(function () {
            Email.send({
                to: values.recipient,
                from: Config.mailServer.address,
                subject: values.subject,
                html: JET.render('broadcastEmail', {
                    "subject": values.subject,
                    "content": values.content,
                    "scpLogoUrl": Config.rootUrl + "email/logo.png",
                    "rootUrl": Config.rootUrl
                })
            });
        });
    }
});