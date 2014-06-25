var fs = require("graceful-fs"),
	scan = require("./scan"),
	jstoxml = require('jstoxml'),
	escomplexjs = require('escomplex-js'),
    async = require("async"),
	jshint = require('jshint').JSHINT,
	jslint = require('./jslint-latest.js'),
	CSSLint = require('csslint').CSSLint,
	validator = require('html-validator'),
    _ = require('underscore')._;

var analyseReportClass = module.exports = {
		attachReports: function(relations,callback){

			relations = JSON.parse(relations);

			var relationsWithReport = new Array();
			async.map(relations.nodes, function(node,cb) {
			//	async.map(analyseReportClass.readAsync)

				if(node.exist !== true){
					cb(null,node);
					return;
				}

				switch(node.group){
					case 1:
						try{
						   	analyseReportClass.getHtmlW3cReport(node.name,function(err,report){
								node.report = report;
								node.reportCount = node.report.length;
								cb(err,node);
							});
						}
						catch(err){
							cb(err,node);
						}
					break;
					case 2:
						analyseReportClass.getJsLintReport(node.name,function(err,report){
							node.report = report;
							node.reportCount = node.report.length;
							//vraiment slow

							analyseReportClass.getComplexiteAnalyse(node.name,function(err2,complexityReport){
								node.complexity = complexityReport;
								cb(err,node);
							});			
						});
						
					break;
					case 3:
						analyseReportClass.getCssLintReport(node.name,function(err,report){
							node.report = report;
							node.reportCount = node.report.length;
							cb(err,node);
						});					
					break;
					default:
						cb(null,node);
				}
				
			},function(err,result) {
				if(err){
					console.log(err);
				}
				
				callback(null,JSON.stringify(relations));
			});  

		},
		getHtmlW3cReport: function(file,callback){
			
			fs.readFile( file, 'utf-8', function( err, html) {
			  //if (err) throw err;

			  validator({format : 'json', data:'html', validator:'http://html5.validator.nu'}, function(err, data){
			    //if(err) throw err;

			    if(_.isUndefined(data.message)== false){
				    _.each(data.messages, function (message,key) {
						    		
						    		
						data.messages[key].message = analyseReportClass.removeSpecialChar(data.messages[key].message);
						    		
						    		
					});


				    //data.message = analyseReportClass.removeSpecialChar(data);
				    callback(err,data.messages);
			    }
			    else{
			    	callback(err,"");
			    }
			  });
			});
		},
	    getJsLintReport: function (file,cbJsLint){
	    	fs.readFile( file, 'utf-8', function( err, data) {

				jslint.JSLINT(data);
				
				var results = jslint.JSLINT.data().errors;
				
				_.each(results, function (val,key) {
					if(val !== null && val.evidence !== null){
						results[key].evidence == null
						delete results[key].evidence;
						results[key].message = analyseReportClass.removeSpecialChar(results[key].message);    		

					}
					else{
						results.splice(key,key);
					}
				});
				cbJsLint(err,results);
			});
	    },
	    getJsHintReport: function (file) {
	       /* var data = fs.readFileSync(file,"utf-8");
			jshint(data);
			var results = new Array();
			_.each(jshint.data().errors, function (r) {
				results.push(r.reason+" on "+"line:"+r.line+" column:"+r.character);
			});
			return results;*/
	    },
	    getCssLintReport: function (file,cbCss) {
	        fs.readFile( file, 'utf-8', function( err, data) {

		 		results = CSSLint.verify(data);
				
		 		_.each(results.messages, function (message,key) {				    		
					results.messages[key].evidence = null;
					results.messages[key].rule = null;	
					results.messages[key].message = analyseReportClass.removeSpecialChar(results.messages[key].message);    		
				});
				cbCss(err,results.messages);
		 	});	 	
	    },
	    getComplexiteAnalyse: function (file,cbCp){
	    	//Pas assez vite !


	    	fs.readFile(file, 'utf-8', function( err, data) {
		    	analyse = escomplexjs.analyse(data);
		    	if(analyse != null){
						delete analyse.aggregate.halstead.operators;
						delete analyse.aggregate.halstead.operands;
						delete analyse.functions;
				}
				cbCp(err,analyse);
			});
			//cbCp("","");
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
	    readAsync: function(file,callback) {
		    fs.readFile(file,"utf-8", function(err,data){
		    	console.log(file+" chargé");
		    	callback(err,[file,data]);
		    });	    	
		}
};