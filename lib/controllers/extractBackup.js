'use strict';

var fs = require("fs"),
    path = require("path"),
	wrench = require("wrench"),
	esprima = require('esprima'),
	jstoxml = require('jstoxml'),
	escomplex = require('escomplex'),
	mozWalker = require('escomplex-ast-moz'),
    async = require("async"),
    assetment = require( "assetment" ),
    _ = require('underscore')._,
    AssetGraph = require('assetgraph');











exports.start = function (req,res){

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
	    getRelations: function(website_folder,fileType){
	    	wrench.readdirRecursive(website_folder, function (error, files) {
		    // live your dreams
			var htmlFileList = new Array();
		    _.each(files, function (currentFile) {
		    	if( (currentFile.substr(currentFile.length-5) == ".html") || (currentFile.substr(currentFile.length-4) == ".htm") || (currentFile.substr(currentFile.length-4) == ".php" )   ){
					htmlFileList.push(website_folder+currentFile.replace(/\\/g,"/"))
	   			}
			});
		    var htmlCount = 1;
		    _.each(htmlFileList, function (filePath) {
		    	relationsClass.findRelations(filePath,function(){
		    		if(htmlFileList.length==htmlCount){


		    			switch(fileType) {
							case "xml":
								var xmlNodeList = new Array();
								var xmlLinkList = new Array();
								var c=0;
								_.each(relationsClass.nodes, function (currentNode) {
									currentNode.id=c;
							    	xmlNodeList.push({"node":currentNode});
							    	c++;
								});
								_.each(relationsClass.links, function (currentLink) {
							    	xmlLinkList.push({"link":currentLink});
								});
								res.setHeader('Content-Type','text/xml');
								res.write(jstoxml.toXML([{"nodes":xmlNodeList},{"links":xmlLinkList}], {header: true, indent: '  '}));
								res.end();
							break;
							case "pdf":
							   	res.setHeader('Content-Type','application/json');
							   	res.end(JSON.stringify({"nodes":relationsClass.nodes,"links":relationsClass.links}));
							    res.end();	
							break;
							default:
							   	res.header('Content-Type','application/json').write(JSON.stringify({"nodes":relationsClass.nodes,"links":relationsClass.links})).end();

						} 

		    		}
		    		htmlCount++;
		    	});
		    });
	});	
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
	    }
	};









	var WEBSITE_FOLDER = "website/etsmtl/";

	var fileType = "";

	if(req.params[0] == "xml" || req.params[0] == "pdf"){
		fileType = req.params[0];
	}


/*
	switch(req.params[0]) {
		case "xml":
			relationsClass.getRelations(WEBSITE_FOLDER,"xml");
		break;
		case "pdf":
			relationsClass.getRelations(WEBSITE_FOLDER,"pdf");
		break;
		default:
			relationsClass.getRelations(WEBSITE_FOLDER,"json");
	} 
*/



	

	

};

