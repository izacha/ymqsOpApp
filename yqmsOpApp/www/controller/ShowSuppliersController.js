app.controller('showSuppliersCtrl', ['$scope', '$http', '$state', '$rootScope', '$filter', function($scope, $http, $state, $rootScope, $filter){
    var dbData = $state.params.obj,
        scom_cd = dbData.scom_cd,
        scom1_nm = dbData.scom1_nm;
    
        $rootScope.currentSupplier = dbData;    
        
        $scope.changeDate(scom_cd);
        $rootScope.headTitle = scom1_nm+" 공급업체 현황 리스트";
    
        $rootScope.backBtnHide = false;       
        $rootScope.backLocation = "/direct";        
                
}]);
