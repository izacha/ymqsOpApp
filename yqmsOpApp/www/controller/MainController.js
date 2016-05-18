app.controller('MainCtrl', ['$scope', '$rootScope', '$state', '$filter', '$http', '$ionicPopup', '$ionicLoading','$timeout',
                            function($scope, $rootScope, $state, $filter, $http, $ionicPopup, $ionicLoading, $timeout){  
   
    var d = new Date();
    var dd = new Date(d.getFullYear(), d.getMonth());
    $scope.selectDate = dd;
    $scope.maxDate = d.getFullYear()+"-"+('0'+(d.getMonth()+1)).slice(-2);
                                
    $scope.data = {
      availableOptions: [
          {id: 'direct', name: '사업장별'},
          {id: 'buyback', name: '생산지별'}
      ],           
    selectedOption: {id: 'direct', name: '사업장별'}
    };   
                                
    $scope.exitApp = function(){        
        var confirmPopup = $ionicPopup.confirm({
        title: '종료',
        template: '앱을 종료하시겠습니까?',
        buttons : [
                {text:'취소'},
                {
                text:'확인',
                type: 'button-positive',
                onTap: function(e) {
                    ionic.Platform.exitApp();        
                 }
                    
                }
            ]    
        });

    };                             
    //날짜를 바꿀 때마다
    $scope.changeDate  = function(){    
        
        $scope.suppliersFlag = false;   // selectbox 공급업체일 때 show/hide
        
         $ionicLoading.show({
          content: '<ion-spinner icon="lines"></ion-spinner>',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          delay: 5
        });
        
        var paramDate = $filter('date')($scope.selectDate, 'yyyy-MM');
        var paramCategory = $scope.data.selectedOption.id;
        
        var paramYear = paramDate.split("-")[0];
        var paramMonth = paramDate.split("-")[1];
        
        var parameter = {
                year: paramYear,
                month: paramMonth,
                category: paramCategory              
        };
        
        //만약 공급업체 현황에 대해서 Click하게 된다면 사업장코드(site_cd)를 받아야하므로
        //arguments.length != 0 인경우에 Parameter로 보내면 된다.
        if(arguments.length !== 0){          
            $scope.suppliersFlag = true;   // selectbox 공급업체일 때 show/hide
            parameter.site_cd = arguments[0];
        }else{            
            if($state.current.name === 'suppliers'){            
                $scope.suppliersFlag = true;
                parameter.site_cd = $rootScope.currentSupplier["scom_cd"];
            }
        }
        var httpPromise = $http.jsonp(
                    url+"/yqms/changeHeadCategory.do?callback=JSON_CALLBACK",
                    {params : parameter}
        );

        httpPromise
            .success(function(data, status, header, config){
//                var category = config.params.category;            
                var ppm_max_arr = [], ppm_goal_max_arr = [], bad_max_arr = [];
                $scope.compSum = 0;                    
                if($state.current.name === 'direct'){    //barChart를 그리기 위해서는 총합에 대한 값이 있어야 함                    
                    angular.forEach(data, function(value, key){                        
                        ppm_max_arr.push(value.ppm);
                        ppm_goal_max_arr.push(value.ppm_goal);
                    });
                    var ppm_max = Math.max.apply(null, ppm_max_arr);
                    var ppm_goal_max = Math.max.apply(null, ppm_goal_max_arr);
                    
                    if(ppm_max > ppm_goal_max){
                        $scope.compMax = ppm_max;
                    }else{
                        $scope.compMax = ppm_goal_max;                    
                    }                
                }else if($state.current.name === 'buyback' || $state.current.name === 'suppliers'){
                    angular.forEach(data, function(value){
                        bad_max_arr.push(value.bad_cnt);                                    
                    });
                    $scope.bad_max = Math.max.apply(null, bad_max_arr);    
                    console.log($scope.bad_max)
                }
                $scope.dbDataList = data;            
            })
            .error(function(data, status, header, config){
                console.log(status);
            }); // end $http()
        
        $timeout(function() {
            $ionicLoading.hide();
        },1000);
        
    };  // end changeDate()
    
    //Category를 바꿀 때마다
    $scope.categoryChange = function(){              
        $scope.changeDate();
        $state.go($scope.data.selectedOption.id, {location: 'replace'});
    };

//    $scope.changeDate();

}]);