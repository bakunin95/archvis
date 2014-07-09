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
			if(_.isUndefined(relations) == false){
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

					analyseReportClass.normalizeData(result,function(err,newNodes){
						console.log("newNodes",newNodes[66]);
						relations.nodes = newNodes;
						console.log(relations.nodes[66]);
						console.log("WTFFFFF");
						callback(err,JSON.stringify(relations));
					});


					
				});  
			}
			else{
				callback(null,"");
			}

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
	    		if(data !== null){
	    			try{
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
		    	if(analyse !== null){



		    		if(_.isUndefined(analyse.aggregate.halstead.operators) == false){
		    			delete analyse.aggregate.halstead.operators.identifiers;
		    		}

		    				    			//delete analyse.aggregate.halstead.operands;


		    		if(_.isUndefined(analyse.aggregate.halstead.operands) == false){
		    			delete analyse.aggregate.halstead.operands.identifiers;
		    		}


		    		if(_.isUndefined(analyse.functions) == false){
		    			analyse.functions = analyse.functions.length;
		    		}
		    		
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
		},
		normalizeData: function(data,cbNormalize){

			var dataMax = [];
			var aggregate = [];
			var halstead = [];
			halstead.operators = [];
			halstead.operands = [];
			var check = null;
			var row = null;
			async.map(data, function(node,cbData) {
				if(node.group == 2 && _.isUndefined(node) == false && _.isUndefined(node.complexity) == false){
					console.log("node",node.complexity);

					row="cyclomatic";
					check = node.complexity.aggregate[row];
					if( aggregate[row] == null || aggregate[row] < check){
						aggregate[row] = check;
					}

					row="cyclomaticDensity";
					check = node.complexity.aggregate[row];
					if( aggregate[row] == null || aggregate[row] < check){
						aggregate[row] = check;
					}

					row="params";
					check = node.complexity.aggregate[row];
					if( aggregate[row] == null || aggregate[row] < check){
						aggregate[row] = check;
					}

					row="line";
					check = node.complexity.aggregate[row];
					if( aggregate[row] == null || aggregate[row] < check){
						aggregate[row] = check;
					}

					row="length";
					check = node.complexity.aggregate.halstead[row];
					if( halstead["lngth"] == null || halstead[row] < check){
						halstead["lngth"] = check;
					}

					row="vocabulary";
					check = node.complexity.aggregate.halstead[row];
					if( halstead[row] == null || halstead[row] < check){
						halstead[row] = check;
					}

					row="difficulty";
					check = node.complexity.aggregate.halstead[row];
					if( halstead[row] == null || halstead[row] < check){
						halstead[row] = check;
					}

					row="volume";
					check = node.complexity.aggregate.halstead[row];
					if( halstead[row] == null || halstead[row] < check){
						halstead[row] = check;
					}

					row="effort";
					check = node.complexity.aggregate.halstead[row];
					if( halstead[row] == null || halstead[row] < check){
						halstead[row] = check;
					}

					row="bugs";
					check = node.complexity.aggregate.halstead[row];
					if( halstead[row] == null || halstead[row] < check){
						halstead[row] = check;
					}

					row="time";
					check = node.complexity.aggregate.halstead[row];
					if( halstead[row] == null || halstead[row] < check){
						halstead[row] = check;
					}

					row="distinct";
					check = node.complexity.aggregate.halstead.operators[row];
					if( _.isUndefined(check) == false && (halstead.operators[row] == null || halstead.operators[row] < check)){
						halstead.operators[row] = check;
					}
					row="total";
					check = node.complexity.aggregate.halstead.operators[row];
					if( _.isUndefined(check) == false && (halstead.operators[row] == null || halstead.operators[row] < check)){
						halstead.operators[row] = check;
					}
					//if(_.isUndefined(node.complexity.aggregate.halstead.operands) == false && _.isUndefined(node.complexity.aggregate.halstead.operands.distinct) == false){
						row="distinct";
						check = node.complexity.aggregate.halstead.operands[row];
						if( _.isUndefined(check) == false && (halstead.operands[row] == null || halstead.operands[row] < check)){
							halstead.operands[row] = check;
						}
						row="total";
						check = node.complexity.aggregate.halstead.operands[row];
						if( _.isUndefined(check) == false && (halstead.operands[row] == null || halstead.operands[row] < check)){
							halstead.operands[row] = check;
						}
					//}
					row="bugs";
					check = node.complexity.aggregate.halstead[row];
					if( halstead[row] == null || halstead[row] < check){
						halstead[row] = check;
					}

					row="maintainability";
					check = node.complexity[row];
					if( dataMax[row] == null || dataMax[row] < check){
						dataMax[row] = check;
					}

					row="functions";
					check = node.complexity[row];
					if( dataMax[row] == null || dataMax[row] < check){
						dataMax[row] = check;
					}

					row="params";
					check = node.complexity[row];
					if( dataMax[row] == null || dataMax[row] < check){
						dataMax[row] = check;
					}

					
		
				}
				if(_.isUndefined(node) == false && _.isUndefined(node.reportCount) == false){
				row="reportCount";
					check = node.reportCount;
					if( dataMax[row] == null || dataMax[row] < check){
						dataMax[row] = check;
					}
				}
				cbData(null,"val");
			},function(err,result) {
				if(err){
					console.log(err);
				}
				aggregate.halstead = halstead;
				dataMax.aggregate = aggregate;

				async.map(data, function(node,cbComplexNorm) {

						node.complexityNormalyzed = {};
					
					if(node.group == 2 && _.isUndefined(node) == false && _.isUndefined(node.complexity) == false){
						
						node.complexityNormalyzed.sloc = {};
						node.complexityNormalyzed.aggregate = {};
						node.complexityNormalyzed.aggregate.halstead = {};
						node.complexityNormalyzed.aggregate.halstead.operators = {};
						node.complexityNormalyzed.aggregate.halstead.operands = {};



						node.complexityNormalyzed.maintainability = node.complexity.maintainability / dataMax.maintainability;
						node.complexityNormalyzed.functions = node.complexity.functions / dataMax.functions;


						node.complexityNormalyzed.params = node.complexity.params / dataMax.params;
						node.complexityNormalyzed.aggregate.cyclomatic = node.complexity.aggregate.cyclomatic / dataMax.aggregate.cyclomatic;
						node.complexityNormalyzed.aggregate.params = node.complexity.aggregate.params / dataMax.aggregate.params;
						node.complexityNormalyzed.aggregate.line = node.complexity.aggregate.line / dataMax.aggregate.line;
						node.complexityNormalyzed.aggregate.cyclomaticDensity = node.complexity.aggregate.cyclomaticDensity / dataMax.aggregate.cyclomaticDensity;

						node.complexityNormalyzed.aggregate.halstead.lngth = node.complexity.aggregate.halstead["lentgh"] / dataMax.aggregate.halstead.lntgh;
						node.complexityNormalyzed.aggregate.halstead.vocabulary = node.complexity.aggregate.halstead.vocabulary / dataMax.aggregate.halstead.vocabulary;
						node.complexityNormalyzed.aggregate.halstead.difficulty = node.complexity.aggregate.halstead.difficulty / dataMax.aggregate.halstead.difficulty;
						node.complexityNormalyzed.aggregate.halstead.volume = node.complexity.aggregate.halstead.volume / dataMax.aggregate.halstead.volume;
						node.complexityNormalyzed.aggregate.halstead.effort = node.complexity.aggregate.halstead.effort / dataMax.aggregate.halstead.effort;
						node.complexityNormalyzed.aggregate.halstead.bugs = node.complexity.aggregate.halstead.bugs / dataMax.aggregate.halstead.bugs;
						node.complexityNormalyzed.aggregate.halstead.time = node.complexity.aggregate.halstead.time / dataMax.aggregate.halstead.time;
					
						node.complexityNormalyzed.aggregate.halstead.operators.distinct = node.complexity.aggregate.halstead.operators.distinct / dataMax.aggregate.halstead.operators.distinct;
						node.complexityNormalyzed.aggregate.halstead.operators.total = node.complexity.aggregate.halstead.operators.total / dataMax.aggregate.halstead.operators.total;

						node.complexityNormalyzed.aggregate.halstead.operands.distinct = node.complexity.aggregate.halstead.operands.distinct / dataMax.aggregate.halstead.operands.distinct;
						node.complexityNormalyzed.aggregate.halstead.operands.total = node.complexity.aggregate.halstead.operands.total / dataMax.aggregate.halstead.operands.total;


					}

					node.complexityNormalyzed.reportCount = node.reportCount / dataMax.reportCount;

					cbComplexNorm(null,node);
				},function(err,result2) {
					if(err){
						console.log(err);
					}
					cbNormalize(err,result2);
				});  
			});  

		}

};