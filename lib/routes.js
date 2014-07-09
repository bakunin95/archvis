'use strict';

var api = require('./controllers/api'),
    constants = require( './controllers/constants' ),
    index = require('./controllers'),
    extract = require('./controllers/extract'),
    tree = require('./controllers/treeRequest'),
    extractForTable = require('./controllers/extractForTable'),

    assetAjaxTest = require('./controllers/assetAjaxTest.js'),
    extractAnalyseComplexite = require('./controllers/extractAnalyseComplexite'),
    readFile = require('./controllers/readFile');

/**
 * Application routes
 */
module.exports = function(app) {

define( 'WEBSITE_FOLDER', "website/", this ); 
define( 'WEBSITE', "etsmtl", this );
define( 'WEBSITE_PATH', constants.WEBSITE_FOLDER + constants.WEBSITE, this );


  // Server API Routes
  app.route('/api/awesomeThings')
    .get(api.awesomeThings);

 // Server Extract
   app.route('/tree/*')
    .get(tree.start);  

  // Server Extract
   app.route('/extract/*')
    .get(extract.start);  

   app.route('/extractForTable/*')
    .get(extractForTable.start);  

  // Server Extract
   app.route('/extractAnalyseComplexite/*')
    .get(extractAnalyseComplexite.start);  

 app.route('/assetAjaxTest/*')
    .get(assetAjaxTest.start);  



  // Server Extract
   app.route('/readFile/*')
    .get(readFile.start);
  

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);

  app.route('/*')
    .get( index.index);
/*
  app.route('/*')
    .get( assetAjaxTest.start);

    */
   
};