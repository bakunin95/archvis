var fs = require("graceful-fs"),
    async = require("async"),
	cheerio = require('cheerio'),
    _ = require('underscore')._;
var libHTML = module.exports = {
		test: function(){

		},
	    getReport: function (file,cbHTML) {
	        cbHTML(null,"");
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
	    findAssets: function(node,data){
    		var assets = new Array();
	    	$ = cheerio.load(data);
	    	$('link[rel=stylesheet]').each(function(i, elem) {
	    		assets.push({"name":(_.isUndefined($(this).attr("href")) ? null: $(this).attr("href"))});	 
			});
			$('script').each(function(i, elem) {
	    		assets.push({"name":(_.isUndefined($(this).attr("src")) ? null: $(this).attr("src"))});	 
			});
			$('a').each(function(i, elem) {
	    		assets.push({"name":(_.isUndefined($(this).attr("href")) ? null: $(this).attr("href"))});	 
			});
			if(assets.length > 0){
	    		return [node,assets]; 
	    	}
	    	else{
	    		return null;
	    	} 
	    },
	    processAssets: function(){

	    }

};