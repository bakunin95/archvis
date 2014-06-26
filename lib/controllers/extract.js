'use strict';
var constants = require( './constants' );
var fs = require("graceful-fs");
var relationsClass = require('./relationsClass');
var analyseReportClass = require('./analyseReportClass');

exports.start = function (req,res){


	var cache  = null;
	res.header('Content-Type','application/json');
	var cachedFile = "cache/cached-extract-"+constants.WEBSITE+".json";


   console.log("req",req.body);

	fs.exists(cachedFile, function(exists) {
	    if (exists) {
	    	fs.readFile(cachedFile, "utf8", function (err, data) {
		        if (err) throw err;




/*
		        async.map(req.body.data, function(filePath,callback){							
			    		
								callback();
			    											    		
			    	},function(err,result){
			    		console.log("done");
			    		console.log(result);
			    	});	    
*/





		        res.end(data);
		    });    
	    }
	    else{
	    	relationsClass.getRelations(constants.WEBSITE_PATH,function(err,relations){
				analyseReportClass.attachReports(relations,function(err,result){
					fs.writeFile(cachedFile, result, function(err) {
					    res.end(result);
					    console.log("req",req);
					}); 
				});
			});
	    }
	});




		
};