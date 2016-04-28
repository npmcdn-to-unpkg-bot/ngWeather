var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

var appId = '5e71e418095fadfc44b618de6b2eccec';
var url = 'http://api.openweathermap.org/data/2.5/forecast/daily';
var api = url + appId;

weatherApp.config(function($routeProvider){
    $routeProvider.
        when('/', {
            templateUrl: 'pages/home.html',
            controller: 'homeController'
        }).
        when('/forecast', {
            templateUrl: 'pages/forecast.html',
            controller: 'forecastController'
        }).
        when('/forecast/:days', {
            templateUrl: 'pages/forecast.html',
            controller: 'forecastController'
        });
});

weatherApp.service('cityNameService', function(){
    this.city = "detroit";
});

weatherApp.controller('homeController', ['$scope', 'cityNameService', function($scope, cityNameService){
    $scope.city = cityNameService.city;
    $scope.$watch('city', function(){
        cityNameService.city = $scope.city;
    });
}]);

weatherApp.controller('forecastController', ['$scope', '$resource','cityNameService', '$filter', '$routeParams', function($scope, $resource, cityNameService, $filter, $routeParams){
    var appId = '5e71e418095fadfc44b618de6b2eccec';
    $scope.cityName = cityNameService.city;
    $scope.days = $routeParams.days || 2;
    $scope.weatherAPI = $resource('http://api.openweathermap.org/data/2.5/forecast/daily', {
        callback: "JSON_CALLBACK" }, {get: {method: "JSONP"}});
    $scope.weatherResult = $scope.weatherAPI.get({q: $scope.cityName, cnt: $scope.days, APPID: appId});
    console.log($scope.weatherResult);
    $scope.convertToFarenheight = function(degK) {
        return Math.round((1.8 * (degK - 273)) + 32);
    };
    $scope.convertToDate = function(dateInMs) {

        var dt = new Date(dateInMs*1000);
        return $filter('date')(dt, 'fullDate');
    };
}]);

weatherApp.directive("weatherReport", function(){
    return {
        restrict: 'E',
        templateUrl: 'directives/weatherReport.html',
        replace: true,
        scope: {
            weatherDay: '=',
            convertToStandard: '&',
            convertToReadableDate: '&',
            dateFormat: '@'
        }
    };
});
