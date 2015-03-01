
'use strict';
var constants = require( './controllers/constants' );
var fs = require('fs-extra');
var fsg = require('graceful-fs');
var relex = require('relex');
var wavi = require('wavi');
var treeClass = require('./controllers/treeClass');
var tableClass = require('./controllers/tableClass');
var prettyHrtime = require('pretty-hrtime');
var process = require('process');

module.exports = function(program) {
	var start = process.hrtime();
	define( 'RELEX_OUTPUT_PATH', "node_modules/relex/data", this );
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
	var generatedGraph = "app/data/classDiagram";
	var generatedGraphPdf = "app/data/classDiagram.pdf";
	var generatedDot = "app/data/classDiagram.dot";
	var includenodemodules = false;

	function getTimerVal(start){
		return prettyHrtime(process.hrtime(start),{precise:false,verbose:false});
	}

	function error(err){
		if(err){
				console.log("main.js",err);
		}	
	}


	console.log("Extraction des relations et analyse des données... ("+getTimerVal(start)+")");
	relex.extract(constants.WEBSITE_PATH,includenodemodules,function(err,report){	
		error(err);

		var grapheJSON = JSON.stringify(report);
			fsg.writeFile(generatedGraphFile, grapheJSON, function(err) {

				console.log("Génération des diagrammes de classes... ("+getTimerVal(start)+")");

				wavi.generateGraphFromJSON("archvis",report,generatedGraph,function(err){
					error(err);
					//wavi.generateGraphFromJSON("pdf",report,generatedGraphPdf,function(err){


						if(constants.TIMER == true){console.log("terminée à: ",getTimerVal(start))}
						console.log("Génération des données du graphe... ("+getTimerVal(start)+")");

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
					//});
				});

			});





			
			
			/*fsg.writeFile(generatedGraphFile, grapheJSON, function(err) {
				error(err)
				wavi.generateGraphFromJSON("svg",report,generatedGraph,function(err){
					wavi.generateGraphFromJSON("pdf",report,generatedGraphPdf,function(err){

					//graphvizClass.generateGraph(grapheJSON,"svg",generatedGraph,generatedDot,function(err){
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
				}); });
			});*/
	});	
};