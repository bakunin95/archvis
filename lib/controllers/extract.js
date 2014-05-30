'use strict';

var fs = require("fs"),
    path = require("path"),
	wrench = require("wrench"),
	esprima = require('esprima'),
	escomplex = require('escomplex'),
	mozWalker = require('escomplex-ast-moz'),
    async = require("async"),
    assetment = require( "assetment" ),
    _ = require('underscore')._,
    AssetGraph = require('assetgraph');


exports.start = function (req,res){

	var WEBSITE_FOLDER = "website/rds/";

	res.writeHead(200, {'Content-Type': 'application/json'});
	var nodes = new Array();
	var links = new Array();
	//var relations = new Array({"nodes":{},"links":{},"sourceCount":0,"targetCount":0});

	var relationsClass = {
	    nodes: new Array(),
	    links: new Array(),
	    "sourceCount":0,
	    "targetCount":0,
	    findNode: function (name){
	    	var c = 0;
	    	var result = null;
	    	_.each(relationsClass.nodes, function (currentNode) {
				if(currentNode.name === name){
					result = c;
				}
				c++;
			});
			return result;
	    },
	    addNodes: function (node) {
	        relationsClass.nodes.push(node);
	        relationsClass.sourceCount++;
	    },
	    addLinks: function (link) {
	        relationsClass.links.push(link);
	    },
	    findRelations: function (htmlFile,callback){
			fs.readFile(htmlFile,"utf-8", function read(err, data) {



				try {
   	
					var assets = assetment(data,{images: false, javascripts: true, stylesheets: true});

					relationsClass.addNodes({"name":htmlFile,"group":1});
					relationsClass.targetCount = relationsClass.sourceCount-1;

					_.each(assets.javascripts, function (currentAsset) {
						var sourceFound = null;
						if(currentAsset.resource !== null){
						 sourceFound = relationsClass.findNode(currentAsset.resource);
						}
						if (sourceFound !== null){
							relationsClass.addLinks({"source":sourceFound,"target":relationsClass.targetCount,"value":10});	
						}
						else{
							relationsClass.addNodes({"name":currentAsset.resource,"group":2});
							relationsClass.addLinks({"source":relationsClass.sourceCount-1,"target":relationsClass.targetCount,"value":10});
						}	
					});

					_.each(assets.stylesheets, function (currentAsset) {
						var sourceFound = null;
						if(currentAsset.resource !== null){
							sourceFound = relationsClass.findNode(currentAsset.resource);
						}
						if (sourceFound !== null){
							relationsClass.addLinks({"source":sourceFound,"target":relationsClass.targetCount,"value":10});
						}
						else{
							relationsClass.addNodes({"name":currentAsset.resource,"group":3});
							relationsClass.addLinks({"source":relationsClass.sourceCount-1,"target":relationsClass.targetCount,"value":10});
						}
					});


			    }
			    catch(err) {
					console.log(err);
			    }

				if(callback) callback();
			});
	    },
	    getD3Relations: function (){
	    	return JSON.stringify({"nodes":relationsClass.nodes,"links":relationsClass.links});
	    }
	};


	wrench.readdirRecursive(WEBSITE_FOLDER, function (error, files) {
	    // live your dreams
		var htmlFileList = new Array();
	    _.each(files, function (currentFile) {
	    	if(currentFile.substr(currentFile.length-5) == ".html"){
				htmlFileList.push(WEBSITE_FOLDER+currentFile.replace(/\\/g,"/"))
   			}
		});
	    var htmlCount = 1;
	    _.each(htmlFileList, function (filePath) {
	    	console.log(filePath);
	    	relationsClass.findRelations(filePath,function(){
	    		if(htmlFileList.length==htmlCount){
	    			res.end(relationsClass.getD3Relations());			
	    		}
	    		htmlCount++;
	    	});
	    });
	});	


};

