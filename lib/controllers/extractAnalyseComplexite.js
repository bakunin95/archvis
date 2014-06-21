'use strict';

var fs = require("fs"),
    path = require("path"),
	wrench = require("wrench"),
	esprima = require('esprima'),
	escomplex = require('escomplex'),
	mozWalker = require('escomplex-ast-moz'),
	jstoxml = require('jstoxml'),
	escomplexjs = require('escomplex-js'),
    async = require("async"),
    scan = require("./scan"),
    assetment = require( "./assetment" ),
    _ = require('underscore')._,
    AssetGraph = require('assetgraph');









exports.start = function (req,res){


	var complexityAnalysisClass = {
	    nodes: new Array(),
	    links: new Array(),
	    "sourceCount":0,
	    "targetCount":0,
	    findNode: function (name){
	    	var c = 0;
	    	var result = null;
	    	_.each(complexityAnalysisClass.nodes, function (currentNode) {
				if(currentNode.name === name){
					result = c;
				}
				c++;
			});
			return result;
	    },
	    addNodes: function (node) {
	        complexityAnalysisClass.nodes.push(node);
	        complexityAnalysisClass.sourceCount++;
	    },
	    addLinks: function (link) {
	        complexityAnalysisClass.links.push(link);
	    },


	    analysis: function(myfile){
	    	var ast = esprima.parse(fs.readFileSync(myfile));

	    
			var result = null;

	    	try {
	    		result = escomplex.analyse(ast,mozWalker);
			}
			catch(err) {
				result = "erreur";
			}

			return result;
	    },
	    getRelations: function(website_folder,fileType){


 var resultAnalyse = new Array();
			var jsFileList = new Array();
			var thething = [];
			var filePath = "";


 console.log("true");





  scan(website_folder, '.js', function(err, files) {



	  // 	wrench.readdirRecursive(website_folder, function (error, files) {
		    // live your dreams
		
			
			console.log(files);
		  /*  _.each(files, function (currentFile) {   	
		    	if( (currentFile.substr(currentFile.length-3) == ".js") ){
					filePath = currentFile.replace(/\\/g,"/");
					jsFileList.push(filePath);
					thething.push(filePath);
	   			}	
	   			console.log(JSON.stringify(jsFileList));
	   			console.log("ein");
	   			console.log(thething);
	   				   			console.log(currentFile);

			});*/
		    var analyse = null;
		    var astList = new Array();
		   // console.log(jsFileList);
			_.each(files, function (currentPath) {

				analyse = escomplexjs.analyse(fs.readFileSync(currentPath));

				//astList.push( esprima.parse(fs.readFileSync(currentPath)) );



				if(analyse != null){
					analyse.file = currentPath;
					analyse.aggregate.halstead.operators = null;
					analyse.aggregate.halstead.operands = null;
					analyse.functions = null;
					resultAnalyse.push(analyse);
				}
				
				
					
				//if(resultAnalyse.length==jsFileList.length){
					//res.end(JSON.stringify(resultAnalyse));
				//}

			});
	    		

					

			switch(fileType) {
				case "xml":
				
				/*	var xmlNodeList = new Array();
					var xmlLinkList = new Array();
					var c=0;
					_.each(relationsClass.nodes, function (currentNode) {
						currentNode.id=c;
				    	xmlNodeList.push({"node":currentNode});
				    	c++;
					});
					_.each(relationsClass.links, function (currentLink) {
				    	xmlLinkList.push({"link":currentLink});
					});*/
console.log("its xml");
					res.end(jstoxml.toXML(resultAnalyse, {header: true, indent: '  '}));
					
				break;
				case "pdf":


				break;
				default:
					res.end(JSON.stringify(resultAnalyse));

			} 

		    
		});
	},
	findRelations: function (htmlFile,callback){
		fs.readFile(htmlFile,"utf-8", function read(err, data) {



			try {
	
				var assets = assetment(data,{hyperlink: true, javascripts: true, stylesheets: true});

				complexityAnalysisClass.addNodes({"name":htmlFile,"group":1});
				complexityAnalysisClass.targetCount = complexityAnalysisClass.sourceCount-1;

				_.each(assets.javascripts, function (currentAsset) {
					var sourceFound = null;
					if(currentAsset.resource !== null){
					 sourceFound = complexityAnalysisClass.findNode(currentAsset.resource);
					}
					if (sourceFound !== null){
						complexityAnalysisClass.addLinks({"source":sourceFound,"target":complexityAnalysisClass.targetCount,"value":10});	
					}
					else{
						complexityAnalysisClass.addNodes({"name":currentAsset.resource,"group":2});
						complexityAnalysisClass.addLinks({"source":complexityAnalysisClass.sourceCount-1,"target":complexityAnalysisClass.targetCount,"value":10});
					}	
				});

				_.each(assets.stylesheets, function (currentAsset) {
					var sourceFound = null;
					if(currentAsset.resource !== null){
						sourceFound = complexityAnalysisClass.findNode(currentAsset.resource);
					}
					if (sourceFound !== null){
						complexityAnalysisClass.addLinks({"source":sourceFound,"target":complexityAnalysisClass.targetCount,"value":10});
					}
					else{
						complexityAnalysisClass.addNodes({"name":currentAsset.resource,"group":3});
						complexityAnalysisClass.addLinks({"source":complexityAnalysisClass.sourceCount-1,"target":complexityAnalysisClass.targetCount,"value":10});
					}
				});


		    }
		    catch(err) {
				console.log(err);
		    }

			if(callback) callback();
		});
	}
};








var WEBSITE_FOLDER = "website/emf";
//	var WEBSITE_FOLDER = "website/lvhock";

	var fileType = "";
console.log(req.params[0]);
	if(req.params[0] == "xml" || req.params[0] == "pdf"){
		fileType = req.params[0];
	}
	switch(req.params[0]) {
		case "xml":
		console.log("its xml");
			complexityAnalysisClass.getRelations(WEBSITE_FOLDER,"xml");
		break;
		case "pdf":
			complexityAnalysisClass.getRelations(WEBSITE_FOLDER,"pdf");
		break;
		default:
			//res.header('Content-Type','application/json');
			complexityAnalysisClass.getRelations(WEBSITE_FOLDER,"json");
	} 
};