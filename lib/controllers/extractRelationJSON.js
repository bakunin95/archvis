var relationsClass = require('./extract');



exports.start = function (req,res){

	var WEBSITE_FOLDER = "website/etsmtl/";

	console.log(relationsClass);

	res.header('Content-Type','application/json').end(relationsClass.getRelations(WEBSITE_FOLDER,"json"));
	

};