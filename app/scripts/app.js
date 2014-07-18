'use strict';

var archvisApp = angular.module('archvisApp', ['ngRoute','archvisControllers']);






archvisApp.config(['$routeProvider','$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/graph/', {
        templateUrl: 'views/partials/graph.html',
       controller: 'graphCtrl'
      }).
      when('/tableau/', {
        templateUrl: 'views/partials/tableau.html',
        controller: 'tableauCtrl'
      }).
       when('/extract/', {
      
      }).
      when('/',{
        redirectTo: '/graph/'
      });
     /* otherwise({
        redirectTo: '/graph'
      });*//*
   $locationProvider.html5Mode(true);
  }]);

var archvisControllers = angular.module('archvisControllers', []);

