'use strict';

var relationsClass = require('./relationsClass');
var analyseReportClass = require('./analyseReportClass');

exports.start = function (req,res){
	var WEBSITE_FOLDER = "website/emf";
	var cache  = null;
	res.header('Content-Type','application/json');


	if(cache !== null){
		res.end(cache);
	}
	else{
		relationsClass.getRelations(WEBSITE_FOLDER,function(err,relations){
			analyseReportClass.attachReports(relations,function(err,result){
				cache = result;
				res.end(result);
			});
		});
	}
};