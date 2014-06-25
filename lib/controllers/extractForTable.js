'use strict';
var fs = require("graceful-fs");
var constants = require( './constants' );
var relationsClass = require('./relationsClass');
var analyseReportClass = require('./analyseReportClass');
var _ = require('underscore')._;

exports.start = function (req,res){

	var cachedFile = "cache/cached-extract-"+constants.WEBSITE+".json";

	
	res.header('Content-Type','application/json');








function transformData(result){
	var data = [];
	_.each(JSON.parse(result).nodes, function (node) {
		
		if(node.exist == true){


			var name = (node.infoFile.file == null) ? "":node.infoFile.file;
			var folder = (node.infoFile.folder == null) ? "":node.infoFile.folder;
			var group = (node.group == null) ? "":node.group;

			var errorCount = (_.isUndefined(node.reportCount) == true) ? "":node.reportCount;

			var cyclomatic = "";
			var effort = "";
			var bugs = "";
			var maintainability = "";
			var params = "";
			if(_.isUndefined(node.complexity) == false && _.isUndefined(node.complexity.aggregate) == false){
				cyclomatic = node.complexity.aggregate.cyclomatic;
				effort = node.complexity.aggregate.halstead.effort;
				bugs = node.complexity.aggregate.halstead.bugs;
			}
			if(_.isUndefined(node.complexity) == false){
				maintainability = node.complexity.maintainability;
				params = node.complexity.params;
			}
			data.push({"name":name,"folder":folder, "group":group,"errorCount":errorCount, "cyclomatic":cyclomatic,"effort":effort,"bugs":bugs,"maintainability":maintainability,"params":params});


		}
	});
	return data;
}



	fs.exists(cachedFile, function(exists) {
	    if (exists) {
	    	fs.readFile(cachedFile, "utf8", function (err, data) {
		        if (err) throw err;
		       
		    	var data = transformData(data);	
				res.end( JSON.stringify({"data":data}) );
		    });    
	    }
	    else{
	    	relationsClass.getRelations(constants.WEBSITE_PATH,function(err,relations){
				analyseReportClass.attachReports(relations,function(err,result){
					var data = transformData(result);
					
					res.end( JSON.stringify({"data":data}) );
				});
			});
	    	
	    }
	});


};