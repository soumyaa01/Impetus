
//portal = angular.module('portal',['ngRoute','ngCookies']);
 
 portal.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider){
      $locationProvider.hashPrefix('');
       
    $routeProvider
    .when('/portal',{
      templateUrl : 'index.html',
      controller : 'ctrlreg'
    })

     .when("/dashboard", {
        templateUrl : 'userview.html',
        controller : 'ctrlreg',
        
       
    })
   
   
   .when("/admin",{
    templateUrl : 'admin.html',
    controller : 'ctrlreg',
   

   })

   .when("/volunteer",{
    templateUrl : 'volunteer.html',
    controller : 'ctrlreg'
   })
  
  
}]);