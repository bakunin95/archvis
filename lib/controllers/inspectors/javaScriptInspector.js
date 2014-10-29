var	esprima = require('esprima');
var	esquery = require('esquery');
var fs = require("graceful-fs");
var async = require("async");



module.exports = function javaScriptInspect(data, callback) {
		var ast = esprima.parse(data);
		var allVariables = esquery.match(ast, esquery.parse('[type="VariableDeclarator"]'));
		var allFunctions = esquery.match(ast, esquery.parse('[type="FunctionDeclarator"]'));
		

		variables = [];
		functions = [];
		objects = [];
		//result.classes = [];
		async.map(allVariables, function(variable,cbVar){	
			if(variable.init == null || (variable.init !== null && variable.init.type == "Literal" || variable.init.type == "CallExpression")){
				variables.push(variable.id.name);
			}
			else if(variable.init.type == "FunctionExpression"){
				functions.push(variable.id.name);
			}
			else if(variable.init.type == "ObjectExpression"){
				objects.push(variable.id.name);
			}

		  cbVar(null,"");										    		
		},function(err,variableList){
				async.map(allFunctions, function(variable,cbVar){
					functions.push(variable.id.name);							
				  	cbVar(null,"");										    		
				},function(err,functionList){
					callback(err,{"variables":variables,"functions":functions, "objects":objects});
				});	    
		});	  

};


