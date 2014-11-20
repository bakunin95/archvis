
'use strict';
var constants = require( './controllers/constants' );
var fs = require('fs-extra');
var fsg = require('graceful-fs');
var relationsClass = require('./controllers/relationsClass');
var analyseReportClass = require('./controllers/analyseReportClass');
var graphvizClass = require('./controllers/graphvizClass'); 
var treeClass = require('./controllers/treeClass');
var tableClass = require('./controllers/tableClass');
var prettyHrtime = require('pretty-hrtime');
var process = require('process');
var libHTML = require('./controllers/languages/libHTML');

module.exports = function(program) {
	var start = process.hrtime();
	define( 'TEMPLATE_PATH', "app", this );
	define( 'WEBSITE_PATH', program.args[0], this );
	define( 'RESULT_PATH', program.args[1], this );


	if (program.timer){
		define( 'TIMER', true, this );	
	}
	else{
		define( 'TIMER', false, this );	
	}

	
	var generatedGraphFile = "app/data/graphe.json";
	var generatedTreeFile = "app/data/arbre.json";
	var generatedTableFile = "app/data/tableau.json";
	var generatedGraph = "app/data/classDiagram.svg";
	var generatedDot = "app/data/classDiagram.dot";

	function getTimerVal(start){
		return prettyHrtime(process.hrtime(start),{precise:true,verbose:true});
	}

	function error(err){
		if(err){
				console.log("***************************************************************");
				console.log("*routes.js*****************************************************");
				console.log(err);
				console.log("***************************************************************");
			}	
	}


	console.log("Extraction des relations...");
	relationsClass.getRelations(constants.WEBSITE_PATH,function(err,relations){	
		error(err);
		if(constants.TIMER == true){console.log("terminée à: ",getTimerVal(start))}	
		console.log("Analyse des données...");
		var grapheJSON = relations;
		analyseReportClass.attachReports(relations,function(err,grapheJSON){
			error(err)
			if(constants.TIMER == true){console.log("terminée à: ",getTimerVal(start))}
			console.log("Génération des données du graphe...");
			fsg.writeFile(generatedGraphFile, grapheJSON, function(err) {
				error(err)
				graphvizClass.generateGraph(grapheJSON,"svg",generatedGraph,generatedDot,function(err){
					error(err)
					if(constants.TIMER == true){console.log("terminée à: ",getTimerVal(start))}
					console.log("Génération des données de l'arbre...");
					treeClass.generateTreeData(function(err,treeJSON){
						error(err)
						fsg.writeFile(generatedTreeFile, treeJSON, function(err) {
							error(err)
							if(constants.TIMER == true){console.log("terminée à: ",getTimerVal(start))}
							console.log("Génération des données du tableau...");
							
							tableClass.generateTableData(grapheJSON,function(err,tableJSON){
								error(err)
								fsg.writeFile(generatedTableFile, tableJSON, function(err) {
									error(err)
									if(constants.TIMER == true){console.log("terminée à: ",getTimerVal(start))}
									console.log("Génération du résultat (HTML)...");

						   			fs.copy( constants.TEMPLATE_PATH, constants.RESULT_PATH, function (err) {
						   				error(err)
										if (err) {
											switch(err[0].errno){
												case 34:
													console.log("Ce chemin est invalide: "+err[0].path);
												break;
												default:
													console.log(err);			   						
											}							  
										} else {
											console.log("Terminée");
										}
										console.log("temps d'exécution total: ",getTimerVal(start));
										process.exit();
									}); 
								});					
							});
						});
					});
				});
			}); 
		});
	});	
};