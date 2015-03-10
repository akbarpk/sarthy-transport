//chirpApp.js
var app=angular.module('chirpApp',['ngRoute','ngResource']).run(function($rootScope,$http){
	$rootScope.authenticated =false;
	$rootScope.current_user="";
	
	$rootScope.signout=function(){
	$http.get('/auth/signout');
		$rootScope.authenticated =false;
	$rootScope.current_user="";
	
	};
});

app.config(function($routeProvider){
	$routeProvider
	//the timeline display
	.when('/',{
		templateUrl: 'main.html',
		controller: 'mainController'
	})
	
	//the login display
	.when('/login',{
		templateUrl: 'login.html',
		controller: 'authController'
	})
	
	//the signup display
	.when('/register',{
		templateUrl: 'register.html',
		controller: 'authController'
	});

});

app.factory('postService', function($resource){
  // var baseUrl = '/api/posts';
  // var factory = {};
  // factory.getAll = function(){
    // return $http.get(baseUrl);
  // };
  // return factory;
  return $resource('/api/posts/:id');
});  

app.controller('mainController',function($rootScope,$scope,postService){

    $scope.posts=postService.query();
	$scope.newPosts={username:'',text:'',created_at:''};
	$scope.post=function(){
	$scope.newPosts.username=$rootScope.current_user;
	
	$scope.newPosts.created_at=Date.now();

	postService.save($scope.newPosts,function( ){
	 $scope.posts=postService.query();
	$scope.newPosts={username:'',text:'',created_at:''};
	});
	// $scope.newPosts.created_at=Date.now();
	// $scope.posts.push($scope.newPosts);
	// $scope.newPosts={username:'',text:'',created_at:''};
	};
});

app.controller('authController',function($scope,$rootScope,$http,$location){
$scope.user={username:'',password:''};
$scope.error_message='';
 $scope.error_messagelogin='';
// postService.getAll().success(function(data){
    // $scope.posts = data;
  // });

  $scope.login=function(){
 //$scope.error_messagelogin='login request for ' + $scope.user.username;
 
  $http.post('/auth/login',$scope.user).success(function(err,data){
 // console.log(err);
   if(err)
   {
   $scope.error_messagelogin=err.message;
   $rootScope.authenticated =false;
	$rootScope.current_user="";
  }
  //else
 // {
 if(!err)
 {
	  $rootScope.authenticated=true;
	  $rootScope.current_user=data.user.username;
	  
	  $location.path('/');
  }
  //}
  });
  // $http.post('/auth/login',$scope.user).failure(function(message){
  // console.log(message);
   // $scope.error_messagelogin=message;
  // });
  };
 $scope.register=function(){
 //$scope.error_message='registeration request for ' + $scope.user.username;
  $http.post('/auth/signup',$scope.user).success(function(err,data){
  //console.log(err);
   if(err){
	 $scope.error_message=err.message;
	 $rootScope.authenticated =false;
	$rootScope.current_user="";
   }
  // else
  if(!err)
  {
  $rootScope.authenticated=true;
  $rootScope.current_user=data.user.username;
  $location.path('/');
  }
  });
 };
});
// app.controller('loginController',function($scope){
// $scope.user={username:'',password:''};
// $scope.error_message='';
 
// // postService.getAll().success(function(data){
    // // $scope.posts = data;
  // // });

 // $scope.login=function(){
// $scope.error_message='login request for ' + $scope.user.username;
 // };
 // // $scope.register=function(){
 // // $scope.error_message='registeration request for ' + $scope.user.username;
 // // };
// });