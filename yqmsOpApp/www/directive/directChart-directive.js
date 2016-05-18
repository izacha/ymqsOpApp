angular.module("directBarDirective",[]).directive("directBar", ["$document", function($document){
    return{
        restrict:"E",
        replace:true,
        scope:{
            data: "=",
            max:"="
            },
        template:"<div style='padding:0 2em;'><canvas width='0' height='0'></canvs></div>",
        link:function(scope, element, attr){
            //scope는 해당 디렉티브 안의 scope
            var data = scope.data;            
            var ppm = data.ppm;
            var ppm_goal = data.ppm_goal;
            var max = scope.max;
                        
            
//막대그래프의 굵기와 Max길이를 설정
            var canvasWidth = element[0].clientWidth * 0.9;
            var canvasHeight = (element[0].parentElement.clientHeight * 1.5);            
            element.css(
                {width:canvasWidth + "px",
                height:canvasHeight + "px"}
            );            
            var canvas = element.children()[0];
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;                        
            
//  ppm과 ppm_goal의 길이 구하기
            var ppm_width = (ppm/max) * canvasWidth;
            var ppm_goal_width = (ppm_goal/max) * canvasWidth;

//  ppm >= ppm_goal 일때는
//  ppm을 먼저그리고 ppm_goal을 나중에 점선으로 그림 (우선순위에 따라서 ppm_goal이 위로 그려져야함)
/*
rgb(47, 64, 116)        //진함 (ppm_goal)
rgb(103, 183, 220)      // 연함 (ppm)
*/
            var ctx = canvas.getContext("2d");    
                if(ppm_width > ppm_goal_width)
                    ctx.fillStyle='#FF6F6F';
                else
                    ctx.fillStyle='rgb(103, 183, 220)';
            
                ctx.fillRect(0,0, ppm_width, canvasHeight);                

                ctx.beginPath();  
                ctx.strokeStyle='rgb(47, 64, 116)';
                ctx.lineWidth = 2;
                ctx.setLineDash([5,3]);
                ctx.moveTo(ppm_goal_width*0.99, 0);
                ctx.lineTo(ppm_goal_width*0.99, canvasHeight);
                ctx.stroke();
                ctx.closePath();
                
                                
                ctx.fillStyle='rgb(47, 64, 116)';   
                ctx.textAlign='right';
                ctx.fillText(ppm_goal, ppm_goal_width*0.98, canvasHeight/2);
    
        }
    };                   
}]);