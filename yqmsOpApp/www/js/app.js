// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('app', ['ionic', 'ngResource', 'clickSwipe', 'directBarDirective', 'buybackBarDirective','nvd3']);

app.run(function($ionicPlatform, $rootScope, $state, $ionicHistory) {
//    url = "http://172.21.26.162:8080/GQMS_OPERATOR";        //로컬Test
        url = "http://221.163.60.237:8298/GQMS_OPERATOR";   //외부Test
//    url = "http://221.163.60.236:8298/GQMS_OPERATOR";   //외부live
    
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }          
  });

    $ionicPlatform.registerBackButtonAction(function(event) {
        var pageName = $state.current.name;
        //direct (start페이지에서 더블 백버튼 클릭시 app exit)
        if (pageName ===  'direct') {
            if ($rootScope.backButtonPressedOnceToExit) {
                ionic.Platform.exitApp();
            }        
            else{
                $rootScope.backButtonPressedOnceToExit = true;
                window.plugins.toast.showShortBottom(
                    "'뒤로'버튼을 한번 더 누르시면 종료됩니다.",function(a){},function(b){}
                );
                setTimeout(function(){
                    $rootScope.backButtonPressedOnceToExit = false;
                },2000);
            }
            event.preventDefault();
            return false;
        }else{
            $ionicHistory.goBack();
        }
  }, 100);
    
    $rootScope.backBtnHide = true;
    
    $rootScope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideCategorySub = false;
        $rootScope.hideYearTrendsSub = true;
        
        //state.name이 yearTrends일때 cateory subHeader를 숨김
        if ($state.current.name === 'yearTrends') {
            $rootScope.hideCategorySub = true;
            $rootScope.hideYearTrendsSub = false;    
        }
        
    });
});

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){
   $stateProvider
    .state('direct',{
       url: '/direct',
       cache:false,       
       templateUrl:'view/direct.html',
       controller:'DirectCtrl'
       
    })
   .state('buyback', {
      url: '/buyback',
       cache:false,
       templateUrl:'view/buyback.html',
       controller:'BuyBackCtrl'
   })
   .state('yearTrends',{
      url: '/yearTrends',
       params:{
           obj:null
       },
      cache:false,
      templateUrl:'view/yearTrends.html',
      controller:'yearTrendsCtrl'
    })
   .state('suppliers',{
       url: '/suppliers',
        params:{
            obj:null
        },
       chache:false,
       templateUrl:'view/suppliers.html',
       controller:'showSuppliersCtrl'       
   });    
    $urlRouterProvider.otherwise('/direct');
    
    
    $ionicConfigProvider.backButton.text('').previousTitleText(false);
});




