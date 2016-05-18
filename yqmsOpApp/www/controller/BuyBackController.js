app.
controller('BuyBackCtrl', ['$scope', '$http', '$state', '$rootScope',
   function($scope, $http, $state, $rootScope){
       $rootScope.headTitle = "생산지별 현황 리스트";
       $rootScope.backBtnHide = false;
       
       $rootScope.backLocation = "/direct";             
       
}]);    