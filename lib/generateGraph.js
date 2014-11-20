
'use strict';
var constants = require( './controllers/constants' );
var fs = require('fs-extra');
var fsg = require('graceful-fs');
var relationsClass = require('./controllers/relationsClass');
var analyseReportClass = require('./controllers/analyseReportClass');
var graphvizClass = require('./controllers/graphvizClass'); 
var process = require('process');
var libHTML = require('./controllers/languages/libHTML');

module.exports = function(program) {
	var start = process.hrtime();
	define( 'TEMPLATE_PATH', "app", this );
	define( 'WEBSITE_PATH', program.args[0], this );


	if(program.args[1] === undefined){
		define( 'RESULT_PATH', "graph", this );
	}
	else{
		define( 'RESULT_PATH', program.args[1], this );
	}

	function error(err){
		if(err){
			console.log("Error",err);
		}	
	}

	relationsClass.getRelations(constants.WEBSITE_PATH,function(err,relations){	
		error(err);
		var grapheJSON = relations;
		analyseReportClass.attachReports(relations,function(err,grapheJSON){
			error(err)		
				if(program.jpg){
					graphvizClass.generateGraph(grapheJSON,"jpg",constants.RESULT_PATH,false,function(err){
						error(err)
					}); 
				}
				if(program.png){
					graphvizClass.generateGraph(grapheJSON,"png",constants.RESULT_PATH,false,function(err){
						error(err)
					}); 
				}
				if(program.svg){
					graphvizClass.generateGraph(grapheJSON,"svg",constants.RESULT_PATH,false,function(err){
						error(err)
					}); 
				}
				if(program.dot){
					graphvizClass.generateGraph(grapheJSON,"dot",constants.RESULT_PATH,false,function(err){
						error(err)
					}); 
				}
		});
	});	
};