var fs = require("fs"),
    path = require("path"),
	scan = require("./scan"),
	Promise = require('promise'),
	when = require('when'),
    rest = require('rest'),
    cheerio = require('cheerio'),
	esprima = require('esprima'),
	jstoxml = require('jstoxml'),
	escomplex = require('escomplex'),
	mozWalker = require('escomplex-ast-moz'),
    async = require("async"),
	jshint = require('jshint').JSHINT,
	jslint = require('./jslint-latest.js'),
	CSSLint = require('csslint').CSSLint,
    assetment = require( "./assetment" ),
    assetAjax = require('./assetAjax'),
    _ = require('underscore')._,
    AssetGraph = require('assetgraph');


var relationsClass = module.exports = {
    nodes: new Array(),
    links: new Array(),
    processed: false,
    website_folder: null,
    "sourceCount":0,
    "targetCount":0,
    findNode: function (name){
    	// utiliser indexof ?
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
    	
    	node.exist = fs.existsSync(node.name);
    	//node.info = relationsClass.getInfoFile(node.resource);
	  	relationsClass.nodes.push(node);
    	relationsClass.sourceCount++;
    	return relationsClass.nodes.indexOf(node);
    },
    addLinks: function (link) {
        relationsClass.links.push(link);
    },
    getRelations: function(website_folder,callbackMain){

	    	if(relationsClass.processed == true){
	    		callbackMain(null, relationsClass.result);
	    		return;
	    	}

	    	async.waterfall([
			    function(callbackHTML){
			    	// Trouver les fichiers *.HTML
			    	scan(website_folder, '.html', function(err, htmlFileList) {
			    		console.log("Trouver les fichiers HTML");
						callbackHTML(err,htmlFileList);
			    	});

			    
			    },
			    function(htmlFileList,callbackAssets){
			    	// Trouver tous les assets (fichiers et liens)
			    	console.log("Trouver tous les assets (fichiers et liens)");
			    	async.map(htmlFileList, function(filePath,callbackTrouverAssets){							
			    		relationsClass.readAsync(filePath,function(err,result){
			    				try{	    					
				    				var assets = relationsClass.findingAssets(result[1]);
				    				var parentId = relationsClass.addNodes({"name":filePath,"group":1, "exist":true});
									relationsClass.processAssets(assets,filePath,parentId,callbackTrouverAssets);
								}catch(erreur){
									callbackTrouverAssets();
				    			}
			    		});											    		
			    	},function(err,result){
			    		console.log("done");
			    		console.log(htmlFileList.length);

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
		
	},
	findingAssets: function(html){
    	var assets = {};

    	assets.stylesheets = new Array();
    	assets.javascripts = new Array();
    	assets.hyperlink = new Array();	

    	$ = cheerio.load(html);

    	$('link[rel=stylesheet]').each(function(i, elem) {
    		assets.stylesheets.push({"resource":(_.isUndefined($(this).attr("href")) ? null: $(this).attr("href"))});	 
		});

		$('script').each(function(i, elem) {
    		assets.javascripts.push({"resource":(_.isUndefined($(this).attr("src")) ? null: $(this).attr("src"))});	 
		});

		$('a').each(function(i, elem) {
    		assets.hyperlink.push({"resource":(_.isUndefined($(this).attr("href")) ? null: $(this).attr("href"))});	 
		});

		return assets;
    },
    processAssets: function(assets,parent,parentId,callbackFindAssets){

		async.parallel({
		    relationsJavaScript: function(cbJs){
		    	console.log("Trouver Javascript");
		    	async.mapSeries(assets.javascripts, function(currentAsset,cb) {
					relationsClass.correctPath(currentAsset.resource,parent,function(err,correctedPath){
						if(_.isUndefined(currentAsset) == false){
							
						    var group = 2;
							var sourceFound = null;
							if(correctedPath !== null){
							 sourceFound = relationsClass.findNode(correctedPath);
							}
							if(correctedPath == null){
								group = 4;
							}

							if (sourceFound !== null){
								relationsClass.addLinks({"source":sourceFound,"target":parentId,"value":10});	
							}
							else{
								var nodeId = relationsClass.addNodes({"name":correctedPath,"group":group});
								relationsClass.addLinks({"source":nodeId,"target":parentId,"value":10});
							}
						cb();	
					}
					
				});
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
			    		relationsClass.correctPath(currentAsset.resource,parent,function(err,correctedPath){

						    var sourceFound = null;
						    var group = 3;


							if(correctedPath !== null){
								sourceFound = relationsClass.findNode(correctedPath);
							}
							else{
								group = 8;
							}
							if (sourceFound !== null){
								relationsClass.addLinks({"source":sourceFound,"target":parentId,"value":10});
							}
							else{
								var nodeId = relationsClass.addNodes({"name":correctedPath,"group":3});
								relationsClass.addLinks({"source":nodeId,"target":parentId,"value":10});
							}
							cb("");
						});
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

					async.map(assets.hyperlink, function(currentAsset,cb) {		
						relationsClass.correctPath(currentAsset.resource,parent,function(err,correctedPath){

						    var sourceFound = null;

							if(correctedPath !== null){
								sourceFound = relationsClass.findNode(correctedPath);
							}
							
							var group = 1;
							if (correctedPath.substring(0, 7) == "http://"){
								group = 5;
							} 
							if (correctedPath.substring(0, 1) == "#"){
								group = 6;
							}
							
							if (correctedPath.substring(0, 7) == "mailto:"){
								group = 7;
							}

							if (sourceFound !== null){
								relationsClass.addLinks({"source":sourceFound,"target":parentId,"value":10});
							}
							else{
								var nodeId = relationsClass.addNodes({"name":correctedPath,"group":group});
								relationsClass.addLinks({"source":nodeId,"target":parentId,"value":10});
							}
							cb("");
						});
					}, function(err) {
						if(err){
							console.log("err",err);
						}
						cbHyperLink(null, 2);				        

						console.log("hyperlink relations found");
					});
			     }  
			},
			function(err, results) {
			    // results is now equals to: {one: 1, two: 2}

			    relationsClass.processed = true;

			    console.log("Fin Trouver Relations");
			    callbackFindAssets();
			});

	},
	correctPath: function(filePath,ParentPath,callback){	
    	if(filePath == null || ParentPath == null){
    		callback(null,filePath);
    		return;
    	}
		var fileInfo = relationsClass.getInfoFile(filePath)
		var parentInfo = relationsClass.getInfoFile(ParentPath)
		var mixedPath = path.normalize(parentInfo.folder +"/"+ filePath); 
		mixedPath = mixedPath.replace(/\\/g,"\/" ).replace("//", "/");
		fs.exists(filePath, function(exists) {
			if (exists) {
			  		callback(null,filePath);
		  	}
		  	else{
		  		fs.exists(mixedPath, function(exists) {
					if (exists) {
					  	callback(null,mixedPath);
				  	}
				  	else{
				  		callback(null,filePath);
				  	}
				});
		  	}
		});
    },
	readAsync: function(file,callback) {
	    fs.readFile(file,"utf-8", function(err,data){
	    	console.log(file+" chargé");
	    	callback(err,[file,data]);
	    });	    	
	},
	getInfoFile: function(filePath){
    	if(filePath !== null){
    	var rePattern = new RegExp("^(.+)/([^/]+)");
    	
		var arrMatches = filePath.match(rePattern);	

			if(arrMatches !== null && arrMatches.length>=2){
				return {file:arrMatches[2],folder:arrMatches[1]};
			}
			else{
				return {file:filePath,folder:""};			
			}
		}
		else{
			return {file:filePath,folder:""};			
		}

    },
	getRelations2: function(website_folder,req,res,callback){
	/*
			res.end(jstoxml.toXML([{"nodes":xmlNodeList},{"links":xmlLinkList}], {header: true, indent: '  '}));
									
				*/
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
	}
};