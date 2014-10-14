'use strict';

var fs = require('fs'),
	esprima = require('esprima'),
	_ = require('underscore')._,
	estraverse = require('estraverse');

	var esquery = require('esquery');


module.exports = function( filename) {
	var assetsList = new Array();
	try{
		var ast = esprima.parse(fs.readFileSync("./"+filename));

		var selectorAst = esquery.parse('[callee.property.name="ajax"][callee.object.name="$"]');


		var ajaxResult = esquery.match(ast, selectorAst);
		if(ajaxResult.length>0){
			//
			console.log(ajaxResult);

			async.map(ajaxResult, function(node,cbComplexNorm) {
				console.log(node);
				assetsList.push(getFirstArg(node));
				cbComplexNorm();
			},function(err){
			});
			console.log(ajaxResult);
			//
		}



		estraverse.traverse(ast, {
			leave: function(node){

		  	if(filename ==="website/archvis/ItsATest.js"){
		  		console.log(node);
		  	}

			},
		  enter: function(node){

		  	console.log(filename);


		    if (isAjax(node)){
				//assetsList.push({type:"ajax",name:getPropertyUrl(node)});
				//assetsList.push(getPropertyUrl(node));
		  	}

		  	if(isGet(node)){
		  		//assetsList.push({type:"get",name:getFirstArg(node)});
		  		assetsList.push(getFirstArg(node));
		  	}

		  	if(isGetJSON(node)){
		  		//assetsList.push({type:"getJSON",name:getFirstArg(node)});
		  		assetsList.push(getFirstArg(node));
		  	}

		  	if(isGetScript(node)){
		  		//assetsList.push({type:"getScript",name:getFirstArg(node)});
		  		assetsList.push(getFirstArg(node));
		  	}

		  	if(isPost(node)){
		  		//assetsList.push({type:"post",name:getFirstArg(node)});
		  		assetsList.push(getFirstArg(node));
		  	}

		  	if(isLoad(node)){
		  		//assetsList.push({type:"load",name:getFirstArg(node)});
		  		assetsList.push(getFirstArg(node));
		  	}

		  	if(isApp(node)){
		  		console.log("haa");
		  		//assetsList.push({type:"app",name:getFirstArg(node)});
		  		assetsList.push(getFirstArg(node));
		  	}

		  }
		});
		return assetsList;
	}catch(err){
		return []
	}

	

	function getFirstArg(node){
		return node.expression.arguments[0].value;
	}


	function getPropertyUrl(node){
		var url = null;
		_.each(node.expression.arguments[0].properties, function (property) {
			if(property.key.name === 'url'){

				if(property.value.name != null){
					url = property.value.name;
				}
				else{
					url = property.value.value;
				}
				
			}
		});
		return url;
	}
	//node.type === 'ExpressionStatement' &&
	function isAjax(node){

if( node.callee.type === 'Identifier' && node.callee.name === '$'){
	console.log("###",node);
}
 

		try{
			if( 
			    node.expression.callee.type === 'MemberExpression' &&
			    node.expression.callee.object.type === 'Identifier' &&
			    node.expression.callee.object.name === '$' &&
			    node.expression.callee.property.type === 'Identifier' &&
			    node.expression.callee.property.name === 'ajax'
			    ){
				return true;
			}
			else if(
				//node.expression.callee.type === 'MemberExpression' &&
			    node.callee.object.type === 'Identifier' &&
			    node.callee.object.name === '$' &&
			    node.callee.property.type === 'Identifier' &&
			    node.callee.property.name === 'ajax'
			   
				){
				return true;
			}
			else{
				return false;
			}
		}
		catch(err){
			return false;
		}
	}



/*
"object": {
                                                                        "type": "CallExpression",
                                                                        "callee": {
                                                                            "type": "MemberExpression",
                                                                            "computed": false,
                                                                            "object": {
                                                                                "type": "Identifier",
                                                                                "name": "$"
                                                                            },
                                                                            "property": {
                                                                                "type": "Identifier",
                                                                                "name": "ajax"
                                                                            }
                                                                        },

*/






	function isGet(node){
		try{
			if( node.type === 'ExpressionStatement' &&
			    node.expression.callee.type === 'MemberExpression' &&
			    node.expression.callee.object.type === 'Identifier' &&
			   (node.expression.callee.object.name === 'jQuery' || 
			   	node.expression.callee.object.name === '$') &&
			    node.expression.callee.property.type === 'Identifier' &&
			    node.expression.callee.property.name === 'get'
			    ){
				return true;
			}
			else{
				return false;
			}
		}
		catch(err){
			return false;
		}
	}

	function isGetJSON(node){
		try{
			if( node.type === 'ExpressionStatement' &&
			    node.expression.callee.type === 'MemberExpression' &&
			    node.expression.callee.object.type === 'Identifier' &&
			   (node.expression.callee.object.name === 'jQuery' || 
			   	node.expression.callee.object.name === '$') &&
			    node.expression.callee.property.type === 'Identifier' &&
			    node.expression.callee.property.name === 'getJSON'
			    ){
				return true;
			}
			else{
				return false;
			}
		}
		catch(err){
			return false;
		}
	}


	function isGetScript(node){
		try{
			if( node.type === 'ExpressionStatement' &&
			    node.expression.callee.type === 'MemberExpression' &&
			    node.expression.callee.object.type === 'Identifier' &&
			   (node.expression.callee.object.name === 'jQuery' || 
			   	node.expression.callee.object.name === '$') &&
			    node.expression.callee.property.type === 'Identifier' &&
			    node.expression.callee.property.name === 'getScript'
			    ){
				return true;
			}
			else{
				return false;
			}
		}
		catch(err){
			return false;
		}
	}


	function isPost(node){
		try{
			if( node.type === 'ExpressionStatement' &&
			    node.expression.callee.type === 'MemberExpression' &&
			    node.expression.callee.object.type === 'Identifier' &&
			   (node.expression.callee.object.name === 'jQuery' || 
			   	node.expression.callee.object.name === '$') &&
			    node.expression.callee.property.type === 'Identifier' &&
			    node.expression.callee.property.name === 'post'
			    ){
				return true;
			}
			else{
				return false;
			}
		}
		catch(err){
			return false;
		}
	}


	function isLoad(node){
		try{
			if( node.type === 'ExpressionStatement' &&
			    node.expression.callee.type === 'MemberExpression' &&
			    node.expression.callee.object.type === 'CallExpression' &&
			   (node.expression.callee.object.callee.name === 'jQuery' || 
			   	node.expression.callee.object.callee.name === '$') &&
			    node.expression.callee.property.type === 'Identifier' &&
			    node.expression.callee.property.name === 'load'
			    ){
				return true;
			}
			else{
				return false;
			}
		}
		catch(err){
			return false;
		}
	}

	// Node Find

	function isApp(node){
		try{
			if( node.type === 'ExpressionStatement' &&
			    node.expression.callee.type === 'MemberExpression' &&
			    node.expression.callee.object.type === 'Identifier' &&
			    node.expression.callee.object.name === 'app' &&
			    node.expression.callee.property.type === 'Identifier' &&
			    (node.expression.callee.property.name === 'get' ||
			    node.expression.callee.property.name === 'post'
			    )
			    ){
				return true;
			}
			else{
				return false;
			}
		}
		catch(err){
			return false;
		}
	}


};
