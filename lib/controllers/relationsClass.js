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





	function readAsync(file,callback) {

		    fs.readFile(file,"utf-8", function(err,data){
		    	callback(err,[file,data]);
		    });
		    
		    	
	}

		



var relationsClass = module.exports = {
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
	    getRelations2: function(website_folder,callback){
	    	
	    	relationsClass.website_folder = website_folder;
			relationsClass.counting = 0;
	    	scan(website_folder, '.html', function(err, htmlFileList) {
				console.log(htmlFileList.length);
					if(relationsClass.result != null){
				    	callback(err, relationsClass.result);
				    	return;
				    }
				    console.log("----------------------------");
				    var count = 0;
				  

				    async.map(htmlFileList, readAsync, function(err, results) {
				    	console.log("done!");
					    
				    	
						async.map(results, relationsClass.findRelations2, function(err,results) {
						
							console.log("done again !");

							console.log("Recherche de relations terminée");
							if(err){
								console.log(err);
							}
							relationsClass.result = JSON.stringify({"nodes":relationsClass.nodes,"links":relationsClass.links});
							callback(err, relationsClass.result);
														
						});
					});
			});
		
	},
	    getRelations: function(website_folder,req,res,callback){
	    	/*
	    	relationsClass.website_folder = website_folder;

			var fileType = "";

			if(req.params[0] == "xml" || req.params[0] == "pdf"){
				fileType = req.params[0];
			}

			switch(req.params[0]) {
				case "xml":
				break;
				case "pdf":
				break;
				default:
					res.header('Content-Type','application/json');
			} 
	    		console.log("----------------------------");

	    	scan(website_folder, '.html', function(err, htmlFileList) {


	    		console.log(htmlFileList.length+ " fichiers html trouvée(s)");


			    var htmlCount = 1;




			    async.map(htmlFileList, function(filePath, callback) {
				   relationsClass.findRelations(filePath,function(){
				   		console.log("Recherche de relations pour "+filePath);
			    		console.log(relationsClass.nodes.length+" relation(s) trouvée pour ce fichier.");
			    		callback(err, relationsClass);
				   });
				}, function(err, results) {
						console.log("fini");
						console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
						//console.log(results);
						console.log(err);
						res.end(JSON.stringify({"nodes":relationsClass.nodes,"links":relationsClass.links}));

						callback(err, JSON.stringify({"nodes":relationsClass.nodes,"links":relationsClass.links}));

				});



*/



/*
			    _.each(htmlFileList, function (filePath) {
			    	
			    	relationsClass.findRelations(filePath,function(){
			    		console.log("Recherche de relations pour "+filePath);
			    		console.log(relationsClass.nodes.length+" relation(s) trouvée pour ce fichier.");


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


							    	//var promise = new Promise(function (resolve, reject) {   
							    		
							    	//	scan(website_folder, '.js', function(err, jsFileList) {
									//				_.each(jsFileList, function (filePath) {
									//					relationsClass.findJsRelations(filePath,function(){});
														
									//				});
									//				resolve("yay");
									//			});
									//});
								
				//promise.then(function() {
						   //res.end(JSON.stringify({"nodes":relationsClass.nodes,"links":relationsClass.links}));

						   return JSON.stringify({"nodes":relationsClass.nodes,"links":relationsClass.links});
						// });
									

							} 
						
			    		}
			    		htmlCount++;
			    	});
			    });*/
			//});

		
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





			var myfile=null;


			
			myfile = relationsClass.findNode(htmlFile.substring(relationsClass.website_folder.length+1));
			if(myfile != null){
				relationsClass.addLinks({"source":relationsClass.sourceCount-1,"target":myfile,"value":10});
			}




		});
	},
	runParallel: function(){
		/*async.parallel({
		    one: function(callback){
		        setTimeout(function(){
		            callback(null, 1);
		        }, 200);
		    },
		    two: function(callback){
		        setTimeout(function(){
		            callback(null, 2);
		        }, 100);
		    }
		},
		function(err, results) {
		    // results is now equals to: {one: 1, two: 2}
		});*/
	},
	findRelations2: function(data,callback){



		console.log(relationsClass.counting++);
			try {
	
				var assets = assetment(data[1],{hyperlink: false, javascripts: true, stylesheets: true});
				relationsClass.addNodes({"name":data[0],"group":1});
				relationsClass.targetCount = relationsClass.sourceCount-1;



				
					
						async.map(assets.javascripts, function(currentAsset,callback) {
							if(_.isUndefined(currentAsset) == false){
								
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
							}
							callback("");
						}, function(err) {
							if(err){
								console.log(err);
							}
							callback(err);
							console.log("javascript relations found");
						});
					
				/*
						if(assets.stylesheets){
					async.map(assets.stylesheets, function(currentAsset,callback) {
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
						callback(err);
					}, function(err) {
						if(err){
							console.log(err);
						}
						console.log("stylesheet relations found");
					});
				}
				if(assets.hyperlink){
					async.map(assets.hyperlink, function(currentAsset,callback) {
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
						callback(err);
					}, function(err) {
						if(err){
							console.log(err);
						}
						console.log("hyperlink relations found");
					});
				}

*/





				

			}catch(err){
				console.log(err);
				//callback(err);
			}
			
		
	},
	findRelations: function (data,callback){
	console.log("whii");
		fs.readFile(htmlFile,"utf-8", function read(err, data) {


	     console.log("whaaa");
		



			try {
	
				var assets = assetment(data,{hyperlink: false, javascripts: true, stylesheets: true});
				relationsClass.addNodes({"name":htmlFile,"group":1});
				relationsClass.targetCount = relationsClass.sourceCount-1;



/*
				
					console.log(assets.javascripts);
						async.map(assets.javascripts, function(currentAsset,callback) {
							if(_.isUndefined(currentAsset) == false){
								console.log(currentAsset);
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
							}
							callback(err);
						}, function(err) {
							if(err){
								console.log(err);
							}
							console.log("javascript relations found");
						});
					
				*/
			/*	if(assets.stylesheets){
					async.map(assets.stylesheets, function(currentAsset,callback) {
					   var sourceFound = null;
					   console.log(currentAsset);
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
						callback(err);
					}, function(err) {
						if(err){
							console.log(err);
						}
						console.log("stylesheet relations found");
					});
				}
				if(assets.hyperlink){
					async.map(assets.hyperlink, function(currentAsset,callback) {
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
						callback(err);
					}, function(err) {
						if(err){
							console.log(err);
						}
						console.log("hyperlink relations found");
					});
				}*/
				if(callback) callback();
		    }
		    catch(err) {
		    	console.log("doh!");
				console.log(err);
				if(callback) callback();
		    }

		});
	}
	/*
	findRelations: function (htmlFile,callback){
		fs.readFile(htmlFile,"utf-8", function read(err, data) {



			try {
	
				var assets = assetment(data,{hyperlink: false, javascripts: true, stylesheets: true});
				
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
	}*/
};