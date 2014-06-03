
var fs = require('fs'),
	scan = require('./scan'),
	_ = require('underscore')._,
	assetAjax = require('./assetAjax');






exports.start = function (req,res){
var website_folder = "website/emf";
scan(website_folder, '.js', function(err, jsFileList) {
				_.each(jsFileList, function (filePath) {
					var assets = assetAjax(filePath);
					var group = 14;
					_.each(assets, function (currentAsset) {
						

						console.log({"name":currentAsset.url,"group":group});

						
					});
				});
			}); 	

	console.log("test");
	//res.send(assetAjax("website/ajaxtest.js"));

};