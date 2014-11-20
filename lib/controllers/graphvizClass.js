var fs = require("graceful-fs"),
	scan = require("./scan"),
    async = require("async"),
    Datastore = require('nedb'),
    _ = require('underscore')._,
    util = require('util'),
    graphviz = require('graphviz');

var graphvizClass = module.exports = {
		generateGraph: function(grapheJSON,type,path,generateDot,cbgenGraph){
			var db = {};
			//db.nodes = new Datastore({'filename':'app/data/nodes.db', 'autoload':'true'});
			//db.links = new Datastore({'filename':'app/data/links.db', 'autoload':'true'}); 

			// Create digraph G
			var g = graphviz.digraph("G");

			var nodes = JSON.parse(grapheJSON).nodes;
			var links = JSON.parse(grapheJSON).links;


			db.nodes = new Datastore();
			db.links = new Datastore();



		

			async.series([ 
				function(cb){

					db.nodes.insert(nodes, function (err, newDoc) {   
						db.links.insert(links, function (err, newDoc) {   
					  		cb();
						}); 
					}); 
				},
				function(cb) {
					async.map(nodes, function(node,cbmap) {
						if(node.group == 1){
							g.addNode(node.name, {"label":'{&laquo;HTML»\\n'+node.name+'|}',"fontsize":"16","shape":"record","style":"filled","fillcolor" : "lavenderblush"} );
						}
						if(node.group == 2){
							
							var variables = node.composition.variables;
							if(variables.length>30){
								variables = variables.slice(0, 30);
								variables.push("...");
							}

							var functions = node.composition.functions
							if(functions.length>30){
								functions = functions.slice(0,30);
								functions.push("...");
							}

							g.addNode( node.name, {"label":'{&laquo;JavaScript»\\n'+node.name+'|'+variables.join('\\l')+'\\l|'+functions.join('\\l')+'\\l}',"fontsize":"12","shape":"record","style":"filled","fillcolor" : "aliceblue"} );

						}
						if(node.group == 3){
							g.addNode( node.name, {"fontsize":"16","shape":"record","style":"filled","fillcolor" : "palegreen"} );
						}
						cbmap(null,"");
					},cb);
			 
			    }, 
			    function(cb) {
			      	async.map(links, function(link,cbmap) {
			       		db.nodes.findOne({id:link.source}, function (err, source) {
			       			graphvizClass.errorHandler(err);
			       			db.nodes.findOne({id:link.target}, function (err, target) {
			       				graphvizClass.errorHandler(err);
			       				if(source !==null && target !== null && source.group <4 && target.group <4){
			       					g.addEdge( source.name, target.name);
			       				}
			       				cbmap(null,"");
							});
						});
					},cb);
			    } 
		    ], function done(err, results) {
		    	graphvizClass.errorHandler(err);
		    	
		    	if(generateDot == true){
		    		fs.writeFile("app/data/classDiagram.dot", g.to_dot(), function(err) {
						graphvizClass.errorHandler(err);
						g.output( type, path );
						cbgenGraph(null,"");
					});
		    	}
		    	else{

			    	if(type == "dot"){
						fs.writeFile(path, g.to_dot(), function(err) {
							graphvizClass.errorHandler(err);
							cbgenGraph(null,"");
						});
			    	}
			    	else{
						graphvizClass.errorHandler(err);
						g.output( type, path ,function(err){
							cbgenGraph(null,"");
						});
						
			    	}
			    }
				
		    });		
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
	    readAsync: function(file,callback) {
		    fs.readFile(file,"utf-8", function(err,data){
		    	graphvizClass.errorHandler(err);
		    	callback(err,[file,data]);
		    });	    	
		},
		errorHandler: function(err){
			if(err){
				console.log("Error in graphvizClass",err);
			}
		}
};