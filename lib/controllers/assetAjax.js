'use strict';

var fs = require('fs'),
	esprima = require('esprima'),
	_ = require('underscore')._,
	estraverse = require('estraverse');


module.exports = function( filename) {


	var assetsList = new Array();
	try{
		//console.log('Processing', filename);
		var ast = esprima.parse(fs.readFileSync(filename));
		estraverse.traverse(ast, {
		  enter: function(node){
		    if (isAjax(node)){
				assetsList.push({type:"ajax",url:getPropertyUrl(node)});
		  	}

		  	if(isGet(node)){
		  		assetsList.push({type:"get",url:getFirstArg(node)});
		  	}

		  	if(isGetJSON(node)){
		  		assetsList.push({type:"getJSON",url:getFirstArg(node)});
		  	}

		  	if(isGetScript(node)){
		  		assetsList.push({type:"getScript",url:getFirstArg(node)});
		  	}

		  	if(isPost(node)){
		  		assetsList.push({type:"post",url:getFirstArg(node)});
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

	function isAjax(node){
		try{
			if( node.type === 'ExpressionStatement' &&
			    node.expression.callee.type === 'MemberExpression' &&
			    node.expression.callee.object.type === 'Identifier' &&
			    node.expression.callee.property.type === 'Identifier' &&
			    node.expression.callee.property.name === 'ajax'
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




};
