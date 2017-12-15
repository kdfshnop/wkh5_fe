/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：rent/list(租房-列表)
 3. 作者：liyang@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


class DetailController extends Controller {
    constructor() {
        super();
        $('.more').hide();
        let rowNum=Math.round($(".base-info").height()/parseFloat($(".base-info").css('line-height')));
        if(rowNum > 5){
            $(".base-info").addClass('word-line');
            $('.more').show();
        }else {
            $(".base-info").removeClass('word-line');
            $('.more').hide();
        }
        $('.more').click(function () {
            $(".base-info").removeClass('word-line');
            $('.more').hide();
        });
        let myChart = echarts.init(document.getElementById('main'),{ width: '88%' });
        // 指定图表的配置项和数据
        let option = {
            xAxis: {
                data: ["7 月","8 月","9 月","10 月","11 月","12 月"],  // X坐标数据
                splitLine: {show: false}, // 控制网格线是否显示
                axisTick: {show: false},  // 去除x轴上的刻度线
                axisLine: {
                    lineStyle: {
                        color: '#979797', // x轴颜色
                    }
                }
            },
            yAxis: {
                axisLine: {show: false},   // y轴是否显示
                splitLine: {
                    show: true,  // 控制网格线是否显示
                    lineStyle: {
                        color: ['#979797'] // y刻度颜色
                    }
                },
                axisTick: {show: false},// 去除y轴上的刻度线
                /*name:'单位：万'*/ // y轴名称单位
            },
            series: [{
                name: '销量',
                type: 'line',
                lineStyle:{
                    normal:{
                        color:'#92A7C3', // 线条颜色
                    }

                },
                itemStyle:{
                    normal:{
                        color: "#92A7C3" //图标颜色
                    }
                },
                data: [0.5, 2.0, 3.6, 1.0, 1.0, 2.0],

            }],
/*            media: [
                {
                    legend:{
                        left:'center',
                        top:'middle'
                    }
                }
            ]*/
        };
        myChart.setOption(option);
    }
}


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new DetailController;
});