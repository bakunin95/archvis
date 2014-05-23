'use strict';

var fs = require("fs"),
    path = require("path"),
	dir = require('node-dir'),
	esprima = require('esprima'),
	escomplex = require('escomplex'),
	mozWalker = require('escomplex-ast-moz'),
    async = require("async"),
    AssetGraph = require('assetgraph');


function stringify(obj, currentDepth, maxDepth) {
  if (currentDepth == maxDepth) return '[Warning: max level reached]'
  var str = '{';
  for (var key in obj) {
    str += key + ': ' + typeof obj == 'object' ?
        stringify(obj[key], currentDepth + 1, maxDepth) :
        obj[key];
  }
  return str + '}'
}

function removeCircular(o) {
	var cache = [];
	var resultat = JSON.stringify(o, function(key, value) {
	    if (typeof value === 'object' && value !== null) {
	        if (cache.indexOf(value) !== -1) {
	            // Circular reference found, discard key
	            return;
	        }
	        // Store value in our collection
	        cache.push(value);
	    }
	    return value;
	});
	cache = null; // Enable garbage collection
	return resultat;
}




exports.start = function (req,res){

	var text = "";




  /*
		
		dir.readFiles("websitesample", {}, 
		function(err, content, next) {
	        if (err) throw err;
	        //console.log('content:', content);
	        next();
	    },
	    function(err, files){
	        if (err) throw err;
	        console.log('finished reading files:',files);
		}

*/
		//var myfile = "websitesample/jquery-ui/js/jquery-ui-1.10.4.custom.js";
		//var myfile = "website/emf/javascript/page.js";

				var myfile = "website/emf/style/main.css";


var ast = esprima.parse(fs.readFileSync(myfile));
var result = escomplex.analyse(ast,mozWalker);
console.log(result);

res.send(result);
//var result = new AssetGraph({root: __dirname + '/../../website/www.rds.ca/'}).loadAssets('index.html').populate({followRelations: {type: 'HtmlAnchor'}});


//var result = new AssetGraph({root: __dirname + '/../../website/www.etsmtl.ca/'}).findAssets();

//var result = new AssetGraph({root: __dirname + '/../../website/testdata/relations/Relation/updateTarget/'}).loadAssets('index.html').;

//var result = new AssetGraph({root: __dirname +'/archvis/website/test/'}).loadAssets('index.html');

//var result = new AssetGraph.loadAssets('../../website/test/*.html');

/*
var result = new AssetGraph({root: __dirname + '/website/test/'}).loadAssets('*.html').populate().run(function (err, assetGraph) {
        console.log(assetGraph);
    });*/

/*
var result = new AssetGraph.Html({
        text: '<html><head><style type="text/css">body {color: red;}</style></head></html>'
    }).populate({
        followRelations: {type: 'HtmlAnchor', to: {url: /\/[bc]\.html$/}}
    });*/

/*
var result = new AssetGraph().loadAssets(new AssetGraph.Html({
	url: "http://example.com/index.html",
        text: '<html><head><style type="text/css">body {color: red;}</style><script src="c.js"></script></head></html>'
    }))3.populate({
        followRelations: {type: 'CssImage'}
    });*/

new AssetGraph({root:  '/website/emf/'})
    .loadAssets('Index.html')
    .populate({followRelations: {to: {url: /^file:/}}})
    //.externalizeRelations({type: 'HtmlScript'})
    //.prettyPrintAssets()
	//.moveAssets({type: 'Css'}, '/images/')
    //.writeAssetsToDisc({type: 'Html'})
    .run(function (err, assetGraph) {




        var htmlAsset = assetGraph.findAssets({fileName: 'Index.html'})[0];
    //  res.setHeader('Content-Type', 'JSON');
      

//console.log(htmlAsset);

    //res.send(htmlAsset);

    // var cropedRes = htmlAsset.assetGraph._assets[1];
//console.log(cropedRes);
	/*fs.writeFile("extracted.json", stringify(htmlAsset,0,6), function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file was saved!");
	    }
	});*/

    // res.send("done");
    }); 






};