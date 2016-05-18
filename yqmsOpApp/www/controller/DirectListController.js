app.
controller("DirectCtrl", ["$scope", "$state", "$rootScope", "$filter", function($scope, $state, $rootScope, $filter){
    $scope.data.selectedOption.id = 'direct';
    $scope.$parent.changeDate();
    
    $rootScope.headTitle = "사업장별 현황 리스트";
    $rootScope.backBtnHide = true;
    
    $scope.ppm = function(dbData){
        var ppm = dbData.ppm;        
        if(ppm == 0) {
            ppm =0;
        }else {
            ppm = $filter('number')(ppm, 0);
        }        
        return ppm;            
    };
        
//달성률 구하는 함수
    $scope.achivRate = function(dbData){
        var ppm_goal = dbData.ppm_goal,
            ppm = dbData.ppm,
            achivementRate;
        if(ppm_goal == 0 || ppm == 0 ) {
            achivementRate = 0;
        }
        else {
            achivementRate = $filter('number')((ppm_goal / ppm) * 100, 0);
        }
        return achivementRate;        
    };
    
//개선율 구하는 함
    $scope.impRate = function(dbData){
        var bad_cnt = dbData.bad_cnt,
            imp_cnt = dbData.imp_cnt,
            implementRate;
        
        if(imp_cnt == 0 || bad_cnt == 0 ){            
            implementRate = 0;
        }else{        
            implementRate = $filter('number')((imp_cnt / bad_cnt) * 100, 0);
        }
        return implementRate;        
    };
}])

//list를 slide 시켰을 때의 이벤트 ctrl
.controller("listOptCtrl", ["$scope", "$state", function($scope, $state){
    $scope.listCanSwipe = true;    
    
    // 연간추이
    $scope.showYearsTrend = function(dbData){
        $state.go('yearTrends', {obj: dbData});
    };
    
    //공급업체
    $scope.showSupplier = function(dbData){
        $state.go('suppliers', {obj: dbData});
    };
}]);