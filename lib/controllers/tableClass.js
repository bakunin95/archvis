var constants = require( './constants' );
var fs = require("graceful-fs");
var    path = require("path");
var _ = require('underscore')._;


var tableClass = module.exports = {
	generateTableData: function(result,callback){
		var data = [];
		_.each(JSON.parse(result).nodes, function (node) {
			
			if(node.exist == true){


				var name = (node.infoFile.file == null) ? "":node.infoFile.file;
				var folder = (node.infoFile.folder == null) ? "":node.infoFile.folder;
				var group = (node.group == null) ? "":node.group;

				switch(group){
					case 1:
					group = "Html";
					break;
					case 2:
					group = "Javascript externe";
					break;
					case 10:
					group = "Javascript externe (liens mort)";
					break;
					case 11:
					group = "Javascript externe (hors serveur)";
					break;
					case 4:
					group = "Javascript interne";
					break;
					case 9:
					group = "Requête ajax";
					break;
					case 3:
					group = "Css externe";
					break;
					case 12:
					group = "Css externe (liens mort)";
					break;
					case 13:
					group = "Css externe (hors serveurs)";
					break;
					case 8:
					group = "Css interne";
					break;
					case 5:
					group = "Lien externe";
					break;
					case 6:
					group = "Ancres Html";
					break;
					case 8:
					group = "Css interne";
					break;
					case 7:
					group = "Lien courriel";
					break;
					case 14:
					group = "Php";
					break;
					case 15:
					group = "Lien divers";
					break;

				}

				var errorCount = (_.isUndefined(node.reportCount) == true) ? "":node.reportCount;

				var cyclomatic = "";
				var paramsAgg = "";
				var line = ""
				var cyclomaticDensity = "";

				//Halstead
				var lngth = "";
				var vocabulary = "";
				var difficulty = "";
				var volume = "";			
				var effort = "";
				var bugs = "";
				var time = "";

				var functions = "";
				var maintainability = "";
				var params = "";

				var operatorsDistinct = "";
				var operatorsTotal = "";

				var operandsDistinct = "";
				var operandsTotal = "";
				
				if(_.isUndefined(node.complexity) == false && _.isUndefined(node.complexity.aggregate) == false){
					cyclomatic = node.complexity.aggregate.cyclomatic.toFixed(2);
					paramsAgg = node.complexity.aggregate.params;
					line = node.complexity.aggregate.line;
					cyclomaticDensity = node.complexity.aggregate.cyclomaticDensity.toFixed(2);

					lngth = node.complexity.aggregate.halstead.length;
					vocabulary = node.complexity.aggregate.halstead.vocabulary;
					difficulty = node.complexity.aggregate.halstead.difficulty.toFixed(2);
					volume = node.complexity.aggregate.halstead.volume.toFixed(2);
					effort = node.complexity.aggregate.halstead.effort.toFixed(2);
					bugs = node.complexity.aggregate.halstead.bugs.toFixed(2);
					time = node.complexity.aggregate.halstead.time.toFixed(2);

					operatorsTotal = node.complexity.aggregate.halstead.operators.total;
					operatorsDistinct = node.complexity.aggregate.halstead.operators.distinct;
					operandsTotal = node.complexity.aggregate.halstead.operands.total;
					operandsDistinct = node.complexity.aggregate.halstead.operands.distinct;
				}
				if(_.isUndefined(node.complexity) == false){
					maintainability = node.complexity.maintainability.toFixed(2);
					functions = node.complexity.functions;
					params = node.complexity.params.toFixed(2);
				}
				data.push({"name":name,"folder":folder, "group":group,"errorCount":errorCount, "cyclomatic":cyclomatic, "paramsAgg":paramsAgg,"line":line,
					 	   "cyclomaticDensity":cyclomaticDensity, "lngth":lngth, "vocabulary":vocabulary,"difficulty":difficulty,"volume":volume,
					       "effort":effort,"bugs":bugs,"time":time,"functions":functions,"maintainability":maintainability,"params":params,
					   	   "operatorsTotal":operatorsTotal,"operatorsDistinct":operatorsDistinct,"operandsTotal":operandsTotal,"operandsDistinct":operandsDistinct});


			}
		});
		callback(null,JSON.stringify({"data":data}));
	}
};