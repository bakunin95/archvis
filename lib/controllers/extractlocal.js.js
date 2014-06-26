'use strict';

var fs = require("fs"),
    path = require("path"),
	scan = require("./scan"),
	  Promise = require('promise'),
	  when = require('when'),
    rest = require('rest'),
	esprima = require('esprima'),
	jstoxml = require('jstoxml'),
	escomplex = require('escomplex'),
	mozWalker = require('escomplex-ast-moz'),
    async = require("async"),
    assetment = require( "./assetment" ),
    assetAjax = require('./assetAjax'),
    _ = require('underscore')._,
    AssetGraph = require('assetgraph');


exports.start = function (req,res){


	var relationsClass = {
	    nodes: new Array(),
	    links: new Array(),
	    website_folder: null,
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
	    	
	    	relationsClass.website_folder = website_folder;



			









	    	scan(website_folder, '.html', function(err, htmlFileList) {








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
									res.end(jstoxml.toXML([{"nodes":xmlNodeList},{"links":xmlLinkList}], {header: true, indent: '  '}));
									
								break;
								case "pdf":


								break;
								default:

/*
							    	var promise = new Promise(function (resolve, reject) {   
							    		
							    		scan(website_folder, '.js', function(err, jsFileList) {
													_.each(jsFileList, function (filePath) {
														relationsClass.findJsRelations(filePath,function(){});
														
													});
													resolve("yay");
												});
									});*/
								
				//promise.then(function() {
							console.log("yay!");
						   res.end(JSON.stringify({"nodes":relationsClass.nodes,"links":relationsClass.links}));
						// });
									

							} 
						
			    		}
			    		htmlCount++;
			    	});
			    });
			});

		
		//return JSON.stringify({"nodes":relationsClass.nodes,"links":relationsClass.links});;	
	},
	findJsRelations: function(htmlFile){
		var assets = assetAjax(htmlFile);
		var group = 14;
		
		_.each(assets, function (currentAsset) {
			var sourceFound = null;

		


			if(currentAsset.url !== null){
				sourceFound = relationsClass.findNode(currentAsset.url);
			}
			if (sourceFound !== null){
				//relationsClass.addLinks({"source":sourceFound,"target":relationsClass.targetCount,"value":10});	
			}
			else{
				relationsClass.addNodes({"name":currentAsset.url,"group":group});
				//relationsClass.addLinks({"source":relationsClass.sourceCount-1,"target":relationsClass.targetCount,"value":10});
			}	



console.log(htmlFile.substring(relationsClass.website_folder.length+1));


			var myfile=null;


			
			myfile = relationsClass.findNode(htmlFile.substring(relationsClass.website_folder.length+1));
			console.log(myfile);
			if(myfile != null){
				console.log("###### Link built");
				relationsClass.addLinks({"source":relationsClass.sourceCount-1,"target":myfile,"value":10});
			}




		});
	},
	findRelations: function (htmlFile,callback){
		fs.readFile(htmlFile,"utf-8", function read(err, data) {



			try {
	
				var assets = assetment(data,{hyperlink: true, javascripts: true, stylesheets: true});
				
				relationsClass.addNodes({"name":htmlFile,"group":1});
				relationsClass.targetCount = relationsClass.sourceCount-1;
				var group = 1;
				_.each(assets.javascripts, function (currentAsset) {
					group = 2;
					var sourceFound = null;
					if(currentAsset.resource !== null){
					 sourceFound = relationsClass.findNode(currentAsset.resource);
					}
					if(currentAsset.resource == null){
						group = 4;
					}

					if (sourceFound !== null){
						relationsClass.addLinks({"source":sourceFound,"target":relationsClass.targetCount,"value":10});	
					}
					else{
						relationsClass.addNodes({"name":currentAsset.resource,"group":group});
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

				_.each(assets.hyperlink, function (currentAsset) {
					var sourceFound = null;
					if(currentAsset.resource !== null){
						sourceFound = relationsClass.findNode(currentAsset.resource);
					}
					if (sourceFound !== null){
						relationsClass.addLinks({"source":sourceFound,"target":relationsClass.targetCount,"value":10});
					}
					else{
							group = 1;
						if (currentAsset.resource.substring(0, 7) == "http://"){
							group = 5;
						} 
						if (currentAsset.resource.substring(0, 1) == "#"){
							group = 6;
						}

						relationsClass.addNodes({"name":currentAsset.resource,"group":group});
						relationsClass.addLinks({"source":relationsClass.sourceCount-1,"target":relationsClass.targetCount,"value":5});
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









	var WEBSITE_FOLDER = "website/sample1";

	var fileType = "";

	if(req.params[0] == "xml" || req.params[0] == "pdf"){
		fileType = req.params[0];
	}



	switch(req.params[0]) {
		case "xml":
			relationsClass.getRelations(WEBSITE_FOLDER,"xml");
		break;
		case "pdf":
			relationsClass.getRelations(WEBSITE_FOLDER,"pdf");
		break;
		default:
			res.header('Content-Type','application/json');
			relationsClass.getRelations(WEBSITE_FOLDER,"json");
	} 




	

	

};

