'use strict';

$('#analyseTable').dataTable( {
    "ajax": 'data/tableau.json',
    "columns": [
    { "data": "name" },
    { "data": "folder" },
    { "data": "group" },
	{ "data": "errorCount" },
	{ "data": "cyclomatic" },
	{ "data": "paramsAgg" },
	{ "data": "line" },
	{ "data": "cyclomaticDensity" },
	{ "data": "lngth" },
	{ "data": "vocabulary" },
	{ "data": "difficulty" },
	{ "data": "volume" },
	{ "data": "effort" },
	{ "data": "bugs" },
	{ "data": "time" },
	{ "data": "functions" },
	{ "data": "maintainability" },
	{ "data": "params" },
	{ "data": "operatorsTotal" },
	{ "data": "operatorsDistinct" },
	{ "data": "operandsTotal" },
	{ "data": "operandsDistinct" }
    ] 
} );