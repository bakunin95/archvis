var fs = require("graceful-fs"),
    async = require("async"),
    path = require("path"),
	escomplexjs = require('escomplex-js'),
	esprima = require('esprima'),
	_ = require('underscore')._,
	estraverse = require('estraverse'),
	esquery = require('esquery'),
	detective = require('detective'),
	detectiveAmd = require('detective-amd'),
	jslint = require('../jslint-latest.js'),
	//assetAjax = require('../assetAjax'),
    _ = require('underscore')._;

var libJavaScript = module.exports = {
	    getReport: function (file,cbJsLint) {
	        fs.readFile( file, 'utf-8', function( err, data) {
	    		if(data !== null){
	    			try{
						jslint.JSLINT(data);			
						var results = jslint.JSLINT.data().errors;
						_.each(results, function (val,key) {
							if(val !== null && val.evidence !== null){
								results[key].evidence == null
								delete results[key].evidence;
								results[key].message = libJavaScript.removeSpecialChar(results[key].message);    		

							}
							else{
								results.splice(key,key);
							}
						});
						cbJsLint(err,results);
					}
					catch(err){
						cbJsLint(err,"");
					}
				}
				else{
					cbJsLint(err,"");
				}
			});
	    },
	    findAssets: function(node,data,cbFindAssets){



	    	async.parallel({
			    detective: function(callback) {

			    	var res = null;
			    	try{
		    			res = detective(data);
		    		}
		    		catch(e){}
			        callback(null, res);
			    },
			    detectiveAmd: function(callback) {
			    	var res = null;
			    	try{
		    			res = detectiveAmd(data);
		    		}
		    		catch(e){}
			        callback(null, res);
			    },
			    ajax: function(callback) {
			    	try{		    		
				    	libJavaScript.assetAjax(data,function(err,results){
				    		callback(null,results);
				    	})
			    	}
		    		catch(e){
		    			callback(null,[]);
		    		}

			    }
			}, function(err, results) {


				var assetsMerge = null;
				if(_.isUndefined(results) == false){
					assetsMerge = _.reject(_.flatten(results),_.isUndefined);
				}

				var assets = new Array();
				for (key in assetsMerge) {
					if(assetsMerge[key] !== null && _.isUndefined(assetsMerge[key]) == false){
						assets.push({"name":assetsMerge[key]});	   		
					}
				}

			   cbFindAssets(null,[node,assets]);
			});
	    },
	    getComplexiteAnalyse: function (file,cbCp){
	    	fs.readFile(file, 'utf-8', function( err, data) {
	    		var analyse = null;
	    		try{
			    	analyse = escomplexjs.analyse(data);

			    	if(analyse !== null){

			    		analyse.aggregate.halstead.time = analyse.aggregate.halstead.time/60/60;

			    		if(_.isUndefined(analyse.aggregate.halstead.operators) == false){
			    			delete analyse.aggregate.halstead.operators.identifiers;
			    		}

			    		if(_.isUndefined(analyse.aggregate.halstead.operands) == false){
			    			delete analyse.aggregate.halstead.operands.identifiers;
			    		}

			    		if(_.isUndefined(analyse.functions) == false){
			    			analyse.functions = analyse.functions.length;
			    		}
			    		
					}
				}	
				catch(e){
				}
				cbCp(err,analyse);
			});		
	    },
	    assetAjax: function(data,cbAssetAjax){
	    	var ast = esprima.parse(data);
			var selectorAst = esquery.parse('[callee.property.name="ajax"][callee.object.name="$"]');
			
			var ajaxResult = esquery.match(ast, selectorAst);
			var assets = new Array();

			if(ajaxResult.length>0){
				for (key in ajaxResult) {
					if(ajaxResult[key] !== null){
						if(_.isUndefined(ajaxResult[key].arguments[0].value) === false){
							assets.push(ajaxResult[key].arguments[0].value);	   		
						}
					}
				}
			}


			async.parallel({
			    isAjax:function(callback) {
			    	var selectorAst = esquery.parse('[callee.object.name="$"][callee.property.name="ajax"]');			
					var ajaxResult = esquery.match(ast, selectorAst);
					var assets = new Array();

					if(ajaxResult.length>0){
						for (key in ajaxResult) {
							if(ajaxResult[key] !== null){
								if(_.isUndefined(ajaxResult[key].arguments[0].value) == false){
									assets.push(ajaxResult[key].arguments[0].value);	   		
								}
							}
						}
					}
			        callback(null, assets);
			    },
			    isGetScript:function(callback) {
			    	var selectorAst = esquery.parse('[callee.object.name="$"][callee.property.name="getScript"]');			
					var ajaxResult = esquery.match(ast, selectorAst);
					var assets = new Array();

					if(ajaxResult.length>0){
						for (key in ajaxResult) {
							if(ajaxResult[key] !== null){
								if(_.isUndefined(ajaxResult[key].arguments[0].value) == false){
									assets.push(ajaxResult[key].arguments[0].value);	   		
								}
							}
						}
					}
			        callback(null, assets);
			    },
			     isLoad:function(callback) {
			    	var selectorAst = esquery.parse('[callee.object.callee.name="$"][callee.property.name="load"]');			
					var ajaxResult = esquery.match(ast, selectorAst);
					var assets = new Array();

					if(ajaxResult.length>0){
						for (key in ajaxResult) {
							if(ajaxResult[key] !== null){
								if(_.isUndefined(ajaxResult[key].arguments[0].value) == false){
									assets.push(ajaxResult[key].arguments[0].value);	   		
								}
							}
						}
					}
			        callback(null, assets);
			    }







			    /*,
			    isJson:function(callback) {
			    	var selectorAst = esquery.parse('[callee.object.name="$"][callee.property.name="getJSON"]');			
					var ajaxResult = esquery.match(ast, selectorAst);
			        callback(null, ajaxResult);
			    },
			    isApp:function(callback) {
			    	var selectorAst = esquery.parse('[callee.object.name="app"][callee.property.name="get"]');			
					var ajaxResult = esquery.match(ast, selectorAst);
			        callback(null, ajaxResult);
			    }*/
			}, function(err, results) {

				
				var resFinal = null;
				if(_.isUndefined(results) == false){
					resFinal = _.reject(_.flatten(results),_.isUndefined);

					
				}

//console.log("resFinal",resFinal);
				
				cbAssetAjax(null,resFinal);

			});






			/*
				//
				console.log(ajaxResult);

				async.map(ajaxResult, function(node,cbComplexNorm) {
					console.log(node);
					assetsList.push(getFirstArg(node));
					cbComplexNorm();
				},function(err){
				});
				console.log(ajaxResult);
				//
				*/
			//}


			return assets;
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
	    }
};