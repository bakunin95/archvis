'use strict';

var relationsClass = require('./relationsClass');
var analyseReportClass = require('./analyseReportClass');


exports.start = function (req,res){
//console.time("relation");
	var WEBSITE_FOLDER = "website/emf";
	res.header('Content-Type','application/json');
	relationsClass.getRelations(WEBSITE_FOLDER,function(err,relations){



		analyseReportClass.attachReports(relations,function(err,result){

			



			res.end(result);
		});


		
/*
		analyseReportClass.getHtmlW3cReport("website/emf/Index.html",function(err,result){
			console.log(result);
		});
*/
	});



	


};

