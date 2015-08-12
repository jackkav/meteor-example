Package.describe({
  name: 'science-search',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use([
    'templating',
    'iron:router',
    'science-lib',
    'jackjiang:solr'
  ]);

  api.addFiles([
    'server/solr.js',
    'server/methods.js'
  ],'server');

  api.addFiles([
    'client/router.js',
    'client/view/search.html',
    'client/view/search.js',
    'client/view/oneArticle.html',
    'client/view/oneArticle.js'
  ],'client');

  //api.addFiles([
  //],['server','client'])
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('science-search');
});
