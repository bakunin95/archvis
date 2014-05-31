'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    extract = require('./controllers/extract'),
    readFile = require('./controllers/readFile');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.route('/api/awesomeThings')
    .get(api.awesomeThings);



  // Server Extract
   app.route('/extract/*')
    .get(extract.start);  

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
};