'use strict';

var relationsClass = require('./relationsClass');


exports.start = function (req,res){
//console.time("relation");
	var WEBSITE_FOLDER = "website/emf";
	res.header('Content-Type','application/json');
	relationsClass.getRelations(WEBSITE_FOLDER,function(err,relations){
		//console.timeEnd("relation");

		console.log("end of line");

		res.end(relations);
	});



	


};

