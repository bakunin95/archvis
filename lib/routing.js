
'use strict';
var constants = require( './controllers/constants' );
var fs = require("graceful-fs");
var relationsClass = require('./controllers/relationsClass');
var analyseReportClass = require('./controllers/analyseReportClass');
var treeClass = require('./controllers/treeClass');

	


module.exports = function(program) {

program.args[1]

define( 'WEBSITE_FOLDER', "website/", this ); 
define( 'WEBSITE', "emf", this );
//define( 'WEBSITE_PATH', constants.WEBSITE_FOLDER + constants.WEBSITE, this );

define( 'WEBSITE_PATH', program.args[0], this );



	console.log("Extraction...");
	var generatedGraphFile = "app/data/graphe.json";
	var generatedTreeFile = "app/data/arbre.json";



	relationsClass.getRelations(constants.WEBSITE_PATH,function(err,relations){
		
		console.log("Analyse...");

		analyseReportClass.attachReports(relations,function(err,grapheJSON){
			console.log("Génération des données du graphe...");
			fs.writeFile(generatedGraphFile, grapheJSON, function(err) {
				console.log("Génération des données de l'arbre...");
				treeClass.generateTreeData(function(err2,treeJSON){
					fs.writeFile(generatedTreeFile, treeJSON, function(err) {
			   			console.log("Terminée");
					});					
				});
			}); 
		});
	});
	    	
	    





		
};