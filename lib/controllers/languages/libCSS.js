var fs = require("graceful-fs"),
    async = require("async"),
	CSSLint = require('csslint').CSSLint,
    _ = require('underscore')._;

module.exports = {
		test: function(){

		},
	    getReport: function (file,cbCss) {
	        fs.readFile( file, 'utf-8', function( err, data) {
	        	libCSS.errorHandler(err); 
		 		results = CSSLint.verify(data);			
		 		_.each(results.messages, function (message,key) {				    		
					results.messages[key].evidence = null;
					results.messages[key].rule = null;	
					results.messages[key].message = module.exports.removeSpecialChar(results.messages[key].message);    		
				});
				cbCss(err,results.messages);
		 	});	 	
	    },
	    findAssets: function(node,data){
			return [node,null];
	    },
	    relations: function(cbCss){
	    	/*async.map(assets.stylesheets, function(currentAsset,cb) {
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
			});*/		


		},
	    removeSpecialChar: function(str){
	    	if(str !== null && _.isUndefined(str) == false){
		    	var str = str.replace(/\\n/g, "\\n")
	                      .replace(/\\'/g, "\\'")
	                      .replace(/\\"/g, '\\"')
	                      .replace(/\\&/g, "\\&")
	                      .replace(/\\r/g, "\\r")
	                      .replace(/\\t/g, "\\t")
	                      .replace(/\\b/g, "\\b")
	                      .replace(/\\f/g, "\\f")
	                      .replace(/\\\//g, "/")
	                      .replace( /([^\x00-\xFF]|\s)*$/g, '')
	                      .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\\\/]/gi, '');
            }
            return str;
	    },
	    errorHandler: function(err){
			if(err){
				console.log("***************************************************************");
				console.log("*libCSS********************************************************");
				console.log(err);
				console.log("***************************************************************");
			}
		}
};