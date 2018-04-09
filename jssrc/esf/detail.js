/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：esf/detail(二手房-详情)
 3. 作者：liyang@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
class DetailController extends Controller {
    constructor() {        
        // 初始化
        super() ;        
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        图片懒加载实例化
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/        
        $(".lazy").lazyload({ 
            "placeholder" : this.staticDomain + "/wkh5_fe/images/common/loading.jpg"
        }) ;  
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        downloadApp条事件绑定
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.addListenerToDownloadApp() ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        打开app按钮点击处理
        schemes参数规则请参照：http://confluence.wkzf/pages/viewpage.action?pageId=80329073
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $(".download-app .download").click(()=> {
            nativeSchema.loadSchema({               
                schema : "external_call/parameter?t=0&bt=1&houseId=" + $("#houseId").val() + "&systemHouseType=1"  ,  // 通过NN打开某个链接
                protocal : "wkzf" , //schema头协议，实际情况填写
                loadWaiting : "1500" , //发起唤醒请求后，会等待loadWaiting时间，超时则跳转到failUrl，默认3000ms                
                failUrl : "https://m.wkzf.com/download/transit?from=esfDetail" ,  //唤起失败时的跳转链接，默认跳转到下载页
                // apk信息,请根据实际情况填写
                apkInfo : {
                    PKG : "com.wukong.ua" ,
                    CATEGORY : "android.intent.category.DEFAULT" ,
                    ACTION : "android.intent.action.VIEW"
                }
            }) ;
        }) ;
        /*
        new WakeupApp({
            element : ".download-app .download" ,
            androidSchemes : "wkzf://external_call/parameter?t=0&bt=1&houseId=" + $("#houseId").val() + "&systemHouseType=1" ,
            isoSchemes : "wkzf://external_call/parameter?t=0&bt=1&houseId=" + $("#houseId").val() + "&systemHouseType=1" ,
            androidDownloadLink : "https://m.wkzf.com/download/transit?from=esfDetail" ,
            iosDownloadLink : "https://m.wkzf.com/download/transit?from=esfDetail"
        }) ;
        */
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        底部经纪人助手条处理
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.addListenerToAssistant() ;

         this.fiveLine() ;         
        // 获取小区加密Id
        let  encryptsubestateid = $('#estateName').attr('data-encryptsubestateid');
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        请求接口 获取折线图参数
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
         let that = this;
         this.request(this.apiUrl.community.chart,{subEstateId:encryptsubestateid},{successCallback(data){
             if (data.status == 1){
                 let dataRes = data;
                 let echartData =  that.recombineM(dataRes.data);
                 that.echartFun(echartData) ;
             }
          }});
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        页面埋点和相册需要的模块
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        let self = this;
        require([ '../components/album.min','../components/bigdata.min'],function(Album, BigData){
            BigData.init(that);
            BigData.bigData({
                "pageName": "1067",
                "pageParam":{
                    "house_id": $('#estateName').attr('data-houseid'),
                    "boutique": $('#estateName').attr('data-boutique')
                },
                "channel":self.GetRequest()['channel'] || "",
                "type": 1
            });
        });
    }        
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    判断文本是否大于5行
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    fiveLine(){
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
    }
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
            $('#estateNameEcharts').hide();
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
            avgPrice = ((maxPrice - minPrice)/4) < 1000 ? 1000:Math.ceil((maxPrice - minPrice)/4000)*1000;
        }
        minPrice =  minPrice < 0 ? 0:minPrice;
        let colorChang = minPrice-avgPrice > 0 ? '#979797':'#fff';
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
                backgroundColor: '#4081D6',
                padding: 4,
                textStyle: {
                    color: '#fff',
                    fontSize: '12'
                },
                formatter:function (params, ticket, callback) {
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
                show:true,
                data: echartData.monthList ,  // X坐标数据
                splitLine: {show: false}, // 控制网格线是否显示
                axisTick: {show: false},  // 去除x轴上的刻度线
                position: 'bottom',
                type: 'category',
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: colorChang, // x轴颜色
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
                    interval: function(index, value) {

                    },
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
                        if ( index == 0) {
                            return "";
                        } else {
                            return (value / 10000).toFixed(1) + ' 万';
                        }
                    }
                },
                min: minPrice - avgPrice,
                max: minPrice + avgPrice * 4,
             /*   min:minPrice-avgPrice > 0 ? minPrice-avgPrice : 0,
                max:minPrice-avgPrice > 0 ? minPrice+ avgPrice * 4:avgPrice * 5,*/
                interval: avgPrice ,
            },
            series: [{
                name: '销量',
                type: 'line',
                lineStyle:{
                    normal:{
                        color:'#4081D6', // 折线条颜色
                    }

                },
                itemStyle:{
                    normal:{
                        color: "#4081D6", //图标颜色
                    },
                    emphasis: { //重点，强调时候的样式，即当鼠标悬停或点击上去的时候的拐点的样式
                        borderColor: '#4081D6',
                        borderWidth: 2,
                        color: '#4081D6'
                    }
                },
                symbolSize: 5,
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
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     截取？后面的参数
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    GetRequest() {
        let url = location.search;
        let theRequest = {};
        if (url.indexOf("?") !== -1) {
            let str = url.substr(1);
            let strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=strs[i].split("=")[1];
            }
        }
        // console.log(theRequest);
        return theRequest;
    }
}


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new DetailController;
});