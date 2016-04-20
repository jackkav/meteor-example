Meteor.isDevelopment = (Meteor.isServer ? process.env.ROOT_URL : window.location.origin).indexOf('localhost') != -1;

Config = {
    isDevMode: Meteor.isDevelopment,
    tempFiles: {
        uploadXmlDir: {
            tmpDir: '/tmp/uploads/tmp',
            uploadDir: '/tmp/uploads'
        },
        uploadExcelDir: '/tmp/excel'
    },
    staticFiles: {
        uploadFiguresDir: Meteor.isDevelopment ? '/tmp/figures' : '/bundle/cfs/files/figures',
        uploadPdfDir: Meteor.isDevelopment ? '/tmp/pdfs' : '/bundle/upload/pdfs',
        uploadPicDir: Meteor.isDevelopment ? '/tmp/images/' : '/bundle/upload/images/',
        uploadFileDir: Meteor.isDevelopment ? '/tmp/files/' : '/bundle/upload/files/'
    },

    ftp: {
        downloadDir: "/tmp/downloads",
        connectOptions: {
            host: "127.0.0.1",
            user: "liu",
            password: "123456",
            port: 21,
            connTimeout: 10000,
            pasvTimeout: 10000
        },
        moveToDir: "/newFile"
    },
    Routes: {
        ADPages: {
            journal: [
                'article.show',
                'article.show.strange',
                'journal.name'
            ],
            global: [
                'home',
                'topics',
                'authorCenter',
                'publishers',
                'publications',
                'collections'
            ]
        },
        NewsPage: {
            journal: [
                'journal.name'
            ],
            global: [
                'home'
            ]
        },
        AccessKey: [
            'publisher.name',
            'publications',
            'journal.name',
            'article.show',
            'article.show.strange',
            'solrsearch'
        ],
        displayJournalLogin: {
            journal: [
                'article.show',
                'article.show.strange',
                'journal.name'
            ]
        }
    },
    Media: {
        allowType: ['mp3', 'mp4', 'ppt', 'pptx'],
        maxSize: 200 //MB
    },
    fieldsFromXmlToUpdate: [
        "title",
        "abstract",
        "journalId",
        "publisher",
        "elocationId",
        "startPage",
        "endPage",
        "padPage",
        "year",
        "month",
        "issue",
        "volume",
        "issueId",
        "volumeId",
        "received",
        "accepted",
        "published",
        "topic",
        "contentType",
        "acknowledgements",
        "pdfId",
        "authors",
        "authorNotes",
        "affiliations",
        "sections",
        "figures",
        "tables",
        "keywords",
        "references",
        "pubStatus",
        "accessKey",
        "language",
        "pacs",
        "fundings"
    ],
    pdf: {
        watermark: "Accepted",
        footmark: "All article content, except where otherwise noted, is licensed under a Creative Commons Attribution 3.0 Unported license.\n"
        + "Downloaded to IP: {ip} On: {time} {url}"
    },
    rootUrl: Meteor.absoluteUrl(),
    searchKeywordFrequency: 3000,
    sysAdmin: "admin",
    parser: {
        contentTypeDic: {
            article: ["article","articles", "论文", "research paper","research papers","feature article","feature articles","invited article","invited articles", "论 文", "特邀论文"],
            reviews:[ "评述","review","reviews","专题论述","综述","mini review","mini reviews","研究述评", "评 述","综 述"],
            letters:["快讯","letter","letters","快 讯","快报","快 报"],
            editorials:["社论","editorials","editorial","Preface","Prefaces","社 论","编者按"],
            highlights:["亮点","highlights","highlight","亮 点","research highlight","research highlights"],
            forums:["论坛","forums","forum","论 坛"],
            progress:["进展","progress","动态","Trends","Trend","动 态","进 展"],
            communications:["信息交流","communications","communication"],
            perspectives:["观点","perspectives","perspective","展望","展 望"],
            correspondance:["争鸣","correspondance","correspondances","争 鸣"],
            interview:["科学访谈","interview","interviews"],
            comments:["评论","comments","comment"],
            newsAndViews:["点评","news & views","news & view"],
            briefReport:["简报","brief report","brief reports","简 报"],
            scienceNews:["科学新闻","science news"],
            bookReview:["书评","book review","book reviews","书 评"],
            mooPaper:["MOO论文","moo paper","moo papers"],
            erratum:["勘误","erratum","erratums","更正","勘 误","更 正"],
            invitedReview:["invited review","invited reviews","特邀评述"],
            retraction:["撤稿","retraction note","retraction notes","retraction","retractions","撤 稿"]
        }
    },
    otherPlatformLoginUrl: {
        scholarone: "https://mc03.manuscriptcentral.com/",
        editors: "http://ees.scichina.com/user/login.action?pageCode="
    },
    otherPlatformRegisterUrl: {
        editors: "http://ees.scichina.com/user/registuser_scichina.action"
    },
    defaultPublisherShortName:"scp"
};
if (Meteor.isServer) {
    Config.defaultAdmin = {
        "username": "admin",
        "password": "123123",
        "level":"admin",
        "email": "admin@scp.com"
    };
    Config.mailServer = {
        //address: "test@scichina.org",
        //password: 'Test123123',
        //server: 'smtp.bestedm.org',
        //port: 25
        address: 'publish@scichina.org',
        password: 'P@ssw0rd',
        server: '219.238.6.202',
        port: 25
    };
    Config.AutoTasks = {
        start: process.env.RUN_TASKS,
        DOI_Register: {
            savePath: "/tmp/doi-register-file/",//生成的注册文件保存位置，必须。
            recvEmail: "kai.jiang@digitalpublishing.cn",//接受注册结果反馈的邮箱地址，必须
            rootUrl: "http://engine.scichina.com/doi/",//必须以/结束 ，必须
            rate: "at 1:00 am",//提交注册请求的频率，默认每晚1点
            condition: 1 //新的注册任务只处理多少天以前注册过，或从未注册过的的doi ,默认1天前
        },
        Citation: {
            rate: "at 1:00 am on Thurs and Sun" //提交注册请求的频率，默认每周六凌晨1点"
        },
        Postman: {
            rate: "at 3:00 am"
        },
        FTPSCAN: {
            rate: "every 30 minutes"
        }
    }
}

