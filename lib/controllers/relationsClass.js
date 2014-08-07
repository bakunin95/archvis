var fs = require("fs"),
    path = require("path"),
    url = require("url"),
	scan = require("./scan"),
    cheerio = require('cheerio'),
    async = require("async"),
	jslint = require('./jslint-latest.js'),
	CSSLint = require('csslint').CSSLint,
    assetment = require( "./assetment" ),
    assetAjax = require('./assetAjax'),
    _ = require('underscore')._;

var relationsClass = module.exports = {
    nodes: new Array(),
    links: new Array(),
    processed: false,
    website_folder: null,
    "sourceCount":0,
    "targetCount":0,
    "internalCount":0,
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
    	node.exist = fs.existsSync(node.name);
    	if(node.exist){
    		node.infoFile = relationsClass.getInfoFile(node.name);
    	}
    	else if (node.group == 2){
    		if(node.name.substr(0, 6) == "http://" || node.name.substr(0, 7) == "https://"){
    			node.group = 11;
    		}
    		else{
    			node.group = 10;	
    		}	
    	}
    	else if (node.group == 3){
    		if(node.name.substr(0, 6) == "http://" || node.name.substr(0, 7) == "https://"){
    			node.group = 13;
    		}
    		else{
    			node.group = 12;	
    		}
    	}
	  	relationsClass.nodes.push(node);
    	relationsClass.sourceCount++;
    	return relationsClass.nodes.indexOf(node);
    },
    getParentNodes: function (node){
    	var parentList = [];
    	var nodeId = relationsClass.nodes.indexOf(node);
    	_.each(relationsClass.links, function (currentLink) {
			if(currentLink.target == nodeId){
				parentList.push(currentLink.source);
			}
		});
    	return parentList;
    },
    getParentNodesFromId: function (nodeId){
    	var parentList = [];
    	_.each(relationsClass.links, function (currentLink) {
			if(currentLink.target == nodeId){
				parentList.push(currentLink.source);
			}
		});
    	return parentList;
    },
    addLinks: function (link) {
    	if(link.source !== link.target){
        	relationsClass.links.push(link);
    	}
    },
    getRelations: function(website_folder,callbackMain){
	    	if(relationsClass.processed == true){
	    		callbackMain(null, relationsClass.result);
	    		return;
	    	}
	    	async.waterfall([
	    		function(callbackFirst){
	    			scan(website_folder, ['js','css'], function(err, fileList) {
			    		async.map(fileList, function(filePath,callbackfileList){
			    			var group = 2;
			    			if(filePath.substring(filePath.length-3,filePath.length).toLowerCase() == ".js"){
			    				group = 2;
			    			}
			    			else if(filePath.substring(filePath.length-4,filePath.length).toLowerCase() == ".css"){
			    				group = 3;
			    			}
				    		relationsClass.addNodes({"name":filePath,"group":group, "exist":true});
				    		callbackfileList();
						},function(err,result){
				    		callbackFirst(err,"");
				    	});
				    }); 
	    		},
			    function(first,callbackHTML){
			    	// Trouver les fichiers *.HTML (doit être en lower case)
				    	scan(website_folder, ['html','php','erb','htm','tpl','jade','ejs','hbs'], function(err, htmlFileList) {
				    		//console.log("Trouver les fichiers HTML");
							callbackHTML(err,htmlFileList);
				    	});   
			    },
			    function(htmlFileList,callbackAssets){
			    	// Trouver tous les assets (fichiers et liens)
			    	//console.log("Trouver tous les assets (fichiers et liens)");
			    	async.map(htmlFileList, function(filePath,callbackTrouverAssets){							
			    		relationsClass.readAsync(filePath,function(err,result){
		    				try{	    					
		    					var group = relationsClass.findHyperlinkNodeGroup(filePath);
			    				var assets = relationsClass.findingAssets(result[1]);
			    				var parentId = relationsClass.addNodes({"name":filePath,"group":group, "exist":true});
								relationsClass.processAssets(assets,filePath,parentId,callbackTrouverAssets);
							}catch(erreur){
								callbackTrouverAssets();
			    			}
			    		});											    		
			    	},function(err,result){
			    		callbackAssets(null,"args2");
			    	});	    	
			    },
			    function(arg2,callbackPST){
			        callbackPST();
			    }
			], function (err, result) {
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
								correctedPath = "["+(relationsClass.internalCount++)+"]";
							}

							if (sourceFound !== null){
								relationsClass.addLinks({"source":sourceFound,"target":parentId });	
								relationsClass.findAjaxRelations(correctedPath,sourceFound,parentId,function(){
									cb();
								});	
							}
							else{
								var nodeId = relationsClass.addNodes({"name":correctedPath,"group":group});
								relationsClass.addLinks({"source":nodeId,"target":parentId });
								relationsClass.findAjaxRelations(correctedPath,nodeId,parentId,function(){
									cb();
								});
							}
	
					}
				});
				},function(err) {
					if(err){
						console.log(err);
					}
					cbJs(null, 1);
					//console.log("Relations JavaScript terminée...");
				});   	
			},
			relationsCss: function(cbCss){
			    	async.map(assets.stylesheets, function(currentAsset,cb) {
			    		relationsClass.correctPath(currentAsset.resource,parent,function(err,correctedPath){
						    var sourceFound = null;
						    var group = 3;
							if(correctedPath !== null){
								sourceFound = relationsClass.findNode(correctedPath);
							}
							else{
								group = 8;
								correctedPath = "["+(relationsClass.internalCount++)+"]";
							}
							if (sourceFound !== null){
								relationsClass.addLinks({"source":sourceFound,"target":parentId});
							}
							else{
								var nodeId = relationsClass.addNodes({"name":correctedPath,"group":3});
								relationsClass.addLinks({"source":nodeId,"target":parentId});
							}
							cb("");
						});
					}, function(err) {
						if(err){
							console.log("err",err);
						}
						cbCss(null, 2);	
						//console.log("Relations Css terminée...");
					});		       				        
			},
			
			relationsHyperLink: function(cbHyperLink){
					async.map(assets.hyperlink, function(currentAsset,cb) {		
						relationsClass.correctPath(currentAsset.resource,parent,function(err,correctedPath){
							var extension = url.parse(correctedPath).pathname;
						    var sourceFound = null;
							if(correctedPath !== null){
								sourceFound = relationsClass.findNode(correctedPath);
							}			
							var group = relationsClass.findHyperlinkNodeGroup(correctedPath);

							if (sourceFound !== null){
								relationsClass.addLinks({"source":sourceFound,"target":parentId});
							}
							else{
								var nodeId = relationsClass.addNodes({"name":correctedPath,"group":group});
								relationsClass.addLinks({"source":nodeId,"target":parentId});
							}
							cb("");
						});
					}, function(err) {
						if(err){
							console.log("err",err);
						}
						cbHyperLink(null, 2);				        
						//console.log("Relations Html terminée");
					});
			     }  
			},
			function(err, results) {
			    relationsClass.processed = true;
			    //console.log("Fin Trouver Relations");
			    callbackFindAssets();
			});

	},
	correctPath: function(filePath,ParentPath,callback){	
    	if(filePath == null || ParentPath == null){
    		callback(null,filePath);
    		return;
    	}
		var fileInfo = relationsClass.getInfoFile(filePath);
		var parentInfo = relationsClass.getInfoFile(ParentPath);
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
	    	//console.log(file+" chargé");
	    	callback(err,[file,data]);
	    });	    	
	},
	getInfoFile: function(filePath){
    	if(filePath !== null && (typeof filePath == "string")){
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
    getExtension: function(correctedPath){
		var filename = "";
		try{
			filename = url.parse(correctedPath).pathname.split(".").pop().toLowerCase();
		}catch(e){}
		return filename;
	},
	findHyperlinkNodeGroup: function(filepath){
		var extension = relationsClass.getExtension(filepath);
		var group = 15;
		if(extension == "php"){
			group = 14;
		}
		else if ((filepath.substring(0, 7) == "http://") || (filepath.substring(0, 8) == "https://")){
			group = 5;
		} 
		else if (filepath.substring(0, 1) == "#"){
			group = 6;
		}
		else if (filepath.substring(0, 7) == "mailto:"){
			group = 7;
		}
		else if(_.contains(["html","htm","","/"], extension)){
			group = 1;
		} 
		
		return group;
	},
	findAjaxRelations: function(file,parentId,grandParentId,cbAjax){
		var assets = assetAjax(file);
		var group = 9;	

		async.each(assets, function(currentAsset, cbEach) {
			var sourceFound = null;
			if(currentAsset.url !== null){
				sourceFound = relationsClass.findNode(currentAsset.url);
			}
			if (sourceFound !== null){
				relationsClass.addLinks({"source":sourceFound,"target":parentId});
				var nodeId = sourceFound;
			}
			else{
				var nodeId = relationsClass.addNodes({"name":currentAsset.url,"group":group});
				relationsClass.addLinks({"source":nodeId,"target":parentId});
			}
			// Les liens d'un fichier javascript sont relatif à l'emplacement du fichier html auxquelle il est relié et non à son propre emplacement.				
			var relativeParentFolder = relationsClass.nodes[grandParentId].infoFile.folder;
			var mixedPath = path.normalize(relativeParentFolder +"/"+ currentAsset.url).replace(/\\/g,"\/" ).replace("//", "/");
			var fileFound = relationsClass.findNode(mixedPath);

			if (fileFound !== null){
				relationsClass.addLinks({"source":fileFound,"target":nodeId});
			}
			cbEach();
		}, function(err) {
		    cbAjax();
		});
	}
};