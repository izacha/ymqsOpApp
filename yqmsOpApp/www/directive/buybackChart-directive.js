angular.module("buybackBarDirective",[]).directive("buybackBar", ["$document", function($document){
    return{
        restrict:"E",
        replace:true,
        scope:{
            data: "=",
            badMax:"="
            },
        template:"<div style='padding:0 4em;'><canvas width='0' height='0'></canvs></div>",
        link:function(scope, element, attr){
            //scope는 해당 디렉티브 안의 scope
            var data = scope.data;            
            var bad_cnt = data.bad_cnt;
            var imp_cnt = data.imp_cnt; 
            var bad_max = scope.badMax;
                        
//막대그래프의 굵기와 Max길이를 설정
            var canvasWidth = element[0].clientWidth * 0.8;
            var canvasHeight = 30;
//            var canvasHeight = (element[0].parentElement.clientHeight * 1.5);            
            
            element.css(
                {
                    width:canvasWidth + "px",                    
                    height:canvasHeight + "px"
                }
            );            
            var canvas = element.children()[0];
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;                        
            

            var bad_width = (bad_cnt/bad_max) * canvasWidth;
            var imp_width = (imp_cnt/bad_max) * canvasWidth;

/*
rgb(47, 64, 116)        //진함 (ppm_goal)
rgb(103, 183, 220)      // 연함 (ppm)
*/
            var ctx = canvas.getContext("2d");    
            ctx.fillStyle='rgb(103, 183, 220)';
            ctx.fillRect(0,0, bad_width, canvasHeight);                
            ctx.fillStyle='rgb(47, 64, 116)';               
            ctx.fillRect(0,0, imp_width, canvasHeight);                
                
                
//                ctx.textAlign='right';
//                ctx.fillText(ppm_goal, ppm_goal_width*0.98, canvasHeight/2);
    
        }
    };                   
}]);