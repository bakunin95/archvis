'use strict';



archvisControllers.controller('tableauCtrl', ['$scope', '$http',
  function ($scope, $http) {
  




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





  }]);
