'use strict';

require('./relationsClass');


exports.start = function (req,res){

	var WEBSITE_FOLDER = "website/etsmtl";
	relationsClass.getRelations(WEBSITE_FOLDER,req,res);

};

