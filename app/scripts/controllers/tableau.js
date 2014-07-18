'use strict';

$('#analyseTable').dataTable( {
    "ajax": 'extractForTable/',
    "columns": [
        { "data": "name" },
        { "data": "folder" },
        { "data": "group" },
	{ "data": "errorCount" },
	{ "data": "cyclomatic" },
	{ "data": "effort" },
	{ "data": "bugs" },
	{ "data": "maintainability" },
	{ "data": "params" },

    ] 
} );