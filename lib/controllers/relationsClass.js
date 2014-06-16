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
		    	console.log(file+" chargé");
		    	console.log(err);
		    	callback(err,[file,data]);
		    });
		    
		    	
	}

	function findAssets(assets,callbackFindAssets){
		if(_.isUndefined(assets) == true){
			callbackFindAssets;
			return;
		}
		async.parallel({
		    relationsJavaScript: function(cbJs){
		    	console.log("Trouver Javascript");
		    	//relationsClass.findJavascriptRelations(fileData,cbJs(null, 1));
		    	async.mapSeries(assets.javascripts, function(currentAsset,cb) {
		    		console.log("1");
					if(_.isUndefined(currentAsset) == false){
						
					    var group = 2;
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
					cb();
				},function(err) {
					if(err){
						console.log(err);
					}
					cbJs(null, 1);
					console.log("javascript relations found");
				});

			    	





			    	
			},
			relationsCss: function(cbCss){
			    	console.log("Trouver Css");

			    	async.map(assets.stylesheets, function(currentAsset,cb) {
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
						cb("");
					}, function(err) {
						if(err){
							console.log("err",err);
						}
						cbCss(null, 2);	
						console.log("stylesheet relations found");
					});
			        
			        				        
			},
			relationsHyperLink: function(cbHyperLink){
			    	console.log("Trouver HyperLink");

			        
			        cbHyperLink(null, 2);				        
			}
			},
			function(err, results) {
			    // results is now equals to: {one: 1, two: 2}

			    relationsClass.processed = true;

			    console.log("Fin Trouver Relations");
			    callbackFindAssets;
			});

	}



var relationsClass = module.exports = {
	    nodes: new Array(),
	    links: new Array(),
	    processed: false,
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
	    getRelations: function(website_folder,callbackMain){
	    	

	    	console.log("test");
	    	if(relationsClass.processed == true){
	    		callbackMain(null, relationsClass.result);
	    		return;
	    	}

	    	async.waterfall([
			    function(callbackHTML){
			    	// Trouver les fichiers *.HTML
			    	scan(website_folder, '.html', function(err, htmlFileList) {
			    		console.log("Trouver les fichiers HTML");
			    		 async.mapSeries(htmlFileList, readAsync, function(err, fileData) {

							console.log(err);
							console.log("Charger le contenu des fichiers");

							callbackHTML(err,fileData);
					
						});

						//callbackHTML(err,htmlFileList);


			    	});

			    
			    },
			    function(fileData,callbackAssets){
			    	// Trouver tous les assets (fichiers et liens)
			    	console.log("Trouver tous les assets (fichiers et liens)");


		    		async.map(fileData, function(data,callbackCurrentData){

		    			try{
		    				var assets = assetment(data[1],{hyperlink: false, javascripts: true, stylesheets: true});
		    			
							relationsClass.addNodes({"name":data[0],"group":1});
							relationsClass.targetCount = relationsClass.sourceCount-1;
							findAssets(assets,callbackCurrentData());

						}catch(err){

							console.log("Fichier invalide"+data[0]);
							//relationsClass.addNodes({"name":data[0],"group":1});
							//relationsClass.targetCount = relationsClass.sourceCount-1;
							callbackCurrentData();

		    			}

		    		}, function(err, fileData) {
		    			
						callbackAssets(null,"args2");
					});




			    	
			    },
			    function(arg2,callbackPST){
			        // arg1 now equals 'three'
			        console.log("PostTraitement",arg2);
			        callbackPST();

			    }
			], function (err, result) {
			   // Fin   
			   console.log("Fin"); 



			   relationsClass.result = JSON.stringify({"nodes":relationsClass.nodes,"links":relationsClass.links});
			   callbackMain(err, relationsClass.result);

	
			});





	    	

	    	/*
	    	relationsClass.website_folder = website_folder;
			relationsClass.counting = 0;
	    	scan(website_folder, '.html', function(err, htmlFileList) {
				console.log("nbfile",htmlFileList.length);
					if(relationsClass.result != null){
				    	callback(err, relationsClass.result);
				    	return;
				    }
				    console.log("----------------------------");
				    var count = 0;
				  

				    async.map(htmlFileList, readAsync, function(err, results) {
				    	console.log("done!");
					    
				    	
						async.map(results, relationsClass.findRelations, function(err,results2) {
						
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
			*/
		
	},
	    getRelations2: function(website_folder,req,res,callback){
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
	findHyperlinkRelations: function(){
			/*
						
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
	},
	findJavascriptRelations: function(assets,callback){
		async.map(assets, function(currentAsset,cb) {
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
			cb();
		},function(err) {
			if(err){
				console.log(err);
			}
			callback(err,"");
			console.log("javascript relations found");
		});
	},
	findStylesheetRelations: function(callback){
		
		async.map(relationsClass.assets.stylesheets, function(currentAsset,cb) {
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
			cb("");
		}, function(err) {
			if(err){
				console.log("err",err);
			}
			callback("done2");
			console.log("stylesheet relations found");
		});
		
	},
	findRelations: function(data,callback){



		console.log("counting",relationsClass.counting++);
			try {
	
				var assets = assetment(data[1],{hyperlink: false, javascripts: true, stylesheets: true});
				relationsClass.addNodes({"name":data[0],"group":1});
				relationsClass.targetCount = relationsClass.sourceCount-1;


				relationsClass.assets = assets;

				async.parallel([relationsClass.findJavascriptRelations//,
				  // two: relationsClass.findStylesheetRelations
				],
				function(err, results) {
				    console.log("parr over");
				   callback("err");

				});

			}catch(err){
				console.log("erreurr:",err);
				callback(err);
			}
			
		
	}
};