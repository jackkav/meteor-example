//InstitutionJournal
Science.Reports.getInstitutionJournalReportFile = function (query, fileName) {
    var type =['journalOverview','journalBrowse','watchJournal'];
    query.action = {$in:type};
    var data = Science.Reports.getInstitutionActionData(query);
    var fields = Science.Reports.getInstitutionJournalReportFields();
    return Excel.export(fileName, fields, data);
};
//InstitutionArticle
Science.Reports.getInstitutionArticleReportFile = function (query, fileName) {
    var type =['fulltext','abstract','pdfDownload','favourite','watchArticle','emailThis'];
    query.action = {$in:type};
    var data = Science.Reports.getInstitutionActionData(query);
    var fields = Science.Reports.getInstitutionArticleReportFields();
    return Excel.export(fileName, fields, data);
};
Science.Reports.getInstitutionJournalReportFields = function () {
    var fields = [
        {
            key: 'number',
            title: '机构编号'
        },
        {
            key: 'type',
            title: '机构类型',
            width: 20
        },
        {
            key: 'name',
            title: '机构名称'
        },
        {
            key: 'journalOverview',
            title: '期刊首页浏览',
            width: 20,
            type: 'number'
        },
        {
            key: 'journalBrowse',
            title: '期刊目录浏览',
            width: 20,
            type: 'number'
        },
        {
            key: 'watchJournal',
            title: '期刊关注',
            width: 20,
            type: 'number'
        }
    ];
    return fields;
};

Science.Reports.getInstitutionArticleReportFields = function () {
    var fields = [
        {
            key: 'number',
            title: '机构编号'
        },
        {
            key: 'type',
            title: '机构类型',
            width: 20
        },
        {
            key: 'name',
            title: '机构名称'
        },
        {
            key: 'fulltext',
            title: '全文浏览',
            width: 20,
            type: 'number'
        },
        {
            key: 'abstract',
            title: '摘要浏览',
            width: 20,
            type: 'number'
        },
        {
            key: 'pdfDownload',
            title: '全文下载',
            width: 20,
            type: 'number'
        },
        {
            key: 'favourite',
            title: '收藏',
            width: 20,
            type: 'number'
        },
        {
            key: 'watchArticle',
            title: '关注',
            width: 20,
            type: 'number'
        },
        {
            key: 'emailThis',
            title: '个人推荐',
            width: 20,
            type: 'number'
        }
    ];
    return fields;
};