'use strict';

var fs = require("fs"),
    path = require("path"),
	esprima = require('esprima'),
	escomplex = require('escomplex'),
	mozWalker = require('escomplex-ast-moz'),
    async = require("async"),
    _ = require('underscore')._;


exports.start = function (req,res){

	var readFile = {
	    "sourceCount":0,
	    "targetCount":0,
	    readRequest: function (filePath) {
	        console.log(filePath);


	        //filePath.replaceAll("\\/", "/");

	        fs.readFile(filePath, 'utf8', function (err,data) {
			  if (err) {
			    res.send("can't read");
			  }

			  res.send(data);
			});



	    }
	};	
	   




	var WEBSITE_FOLDER = "website/etsmtl/";


	res.writeHead(200, {'Content-Type': 'text/html'});

	readFile.readRequest(WEBSITE_FOLDER+req.params[0]);


	
	
	
	

};

