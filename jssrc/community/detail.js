/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：subestate/detail(小区-详情)
 3. 作者：tangxuyang@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
 class DetailController extends Controller {
    constructor() {
        super() ;             
        let self = this ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        页面顶部的返回按钮
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $('.icon-back').on('click',function(){
            window.history.go(-1) ;
        }) ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        相册集图片预览功能
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        require(['../components/album.min','../components/preview-image.min'],function(Album, PreviewImage){
            PreviewImage('.subestate-comments');
        }) ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        请求接口 获取折线图参数
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        let that = this;
        // 获取小区加密Id
        let  encryptsubestateid = $('#estateName').attr('data-encryptsubestateid');
        this.request(this.apiUrl.community.chart,{subEstateId:encryptsubestateid},{successCallback(data){
                if (data.status == 1){
                    let dataRes = data;
                    let echartData =  that.recombineM(dataRes.data);
                    that.echartFun(echartData) ;
                }
            }});
    };

     /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     折线图函数异步操作
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
     echartFun(echartData){
         let seriesData=[];
         let countNum = 0;
         let echartShow = true;
         echartData.seriesData.forEach(function(item,index){
             if(item == 0){
                 seriesData.push(null);
                 countNum += 1;
                 if (countNum == 11 && index == 10){
                     echartShow = false;
                 }
             }else{
                 seriesData.push(parseFloat(item));
             }
         });
         if (!echartShow) {
             $('#estateName').hide();
             return
         }
         let sortArray = echartData.seriesData.sort(function(a, b) {
             return parseFloat(a) - parseFloat(b);
         });
         /* 按照3.12需求文档走势图数据要求*/
         let maxPrice = Math.ceil((sortArray[sortArray.length - 1] / 1000)) * 1000;
         let notZroArray = [];
         sortArray.forEach(function (item,index) {
             if (item != 0){
                 notZroArray.push(item)
             }
         });
         let minPrice = Math.ceil((notZroArray[0] / 1000) - 1) * 1000;
         let avgPrice = 1000 ;
         if (sortArray[sortArray.length - 1] == notZroArray[0] ) {
             minPrice = minPrice - 2000;
             avgPrice = 1000
         }else{
             avgPrice = (maxPrice - minPrice)/4 < 1000 ? 1000:Math.ceil((maxPrice - minPrice)/4000)*1000;
         }
         minPrice =  minPrice < 0 ? 0:minPrice;
         let myChart = echarts.init(document.getElementById('main'),{ width: '88%' });
         let that = this;
         // 给折线图dome增加埋点
         let houseId =  $('#estateName').attr('data-houseid');
         let subestateid =  $('#estateName').attr('data-subestateid') ;
         let echartBigData = {
             "eventName": "1067014",
             "eventParam": { "house_id" : houseId , "estate_id": subestateid },
             "type": 2
         };
         // 指定图表的配置项和数据
         let option = {
             tooltip: {      // 提示框
                 trigger: 'item',
                 triggerOn: 'click',
                 position: 'top',
                 backgroundColor: '#92A7C3',
                 padding: 4,
                 textStyle: {
                     color: '#fff',
                     fontSize: '12'
                 },
                 formatter:function (params) {
                     let paramsValue =  params.value + "元";
                     that.request(that.apiUrl.common.bigData , echartBigData ,function () {

                     });
                     return paramsValue;
                 }
             },
             grid: {
                 bottom: 20,
                 left: '3%',
                 right: '10%',
                 containLabel: true,
             },
             xAxis: {
                 data: echartData.monthList ,  // X坐标数据
                 splitLine: {show: false}, // 控制网格线是否显示
                 axisTick: {show: false},  // 去除x轴上的刻度线
                 position: 'bottom',
                 type: 'category',
                 boundaryGap: false,
                 axisLine: {
                     lineStyle: {
                         color: '#979797', // x轴颜色
                     }
                 },
                 axisLabel: {
                     interval: 0,
                     rotate: 0, //60度角倾斜显示
                     textStyle: {
                         color: '#999',
                         fontSize: 12,
                         fontFamily: '微软雅黑'
                     }
                 },
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
                 axisLabel:{
                     inside: false,
                     textStyle: {
                         color: '#999',
                     },
                     formatter: function(value, index) {
                         if (value == minPrice-avgPrice || value == 0) {
                             return "";
                         } else {
                             return (value / 10000).toFixed(1) + ' 万';
                         }
                     }
                 },
                 min:minPrice-avgPrice > 0 ? minPrice-avgPrice : 0,
                 max:minPrice-avgPrice > 0 ? minPrice+ avgPrice * 4:avgPrice * 5,
                 interval:avgPrice,
             },
             series: [{
                 name: '销量',
                 type: 'line',
                 lineStyle:{
                     normal:{
                         color:'#92A7C3', // 折线条颜色
                     }

                 },
                 itemStyle:{
                     normal:{
                         color: "#92A7C3" //图标颜色
                     },
                     emphasis: { //重点，强调时候的样式，即当鼠标悬停或点击上去的时候的拐点的样式
                         borderColor: '#92A7C3',
                         borderWidth: 2,
                         color: '#92A7C3'
                     }
                 },
                 connectNulls: true,
                 data: seriesData,
             }],
         };
         myChart.setOption(option);
     };
     /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     处理得到的数据的函数  处理月份和数据
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
     recombineM(data) {
         let echartData = {
             monthList: [],
             seriesData: []
         };
         if (data) {
             data.forEach((item) => {
                 let month = item.date.split('-')[1];
                 if (month.indexOf('0') == 0) {
                     echartData.monthList.push(month.charAt(1)+'月')
                 } else {
                     echartData.monthList.push(month+'月')
                 }
                 echartData.seriesData.push(item.unitPrice)
             });
         }
         console.log(echartData);
         return echartData ;
     }
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new DetailController;
}) ;
