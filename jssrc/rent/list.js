/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：rent/list(租房-列表)
 3. 作者：liyang@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


class ListController extends Controller {
    constructor() {
        super();
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        图片懒加载实例化
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/        
        $(".lazy").lazyload({ 
            "placeholder" : this.staticDomain + "/wkh5_fe/images/common/loading.jpg"
        }) ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        根据定位 展示定位附近
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        if($.cookie('location_latitude') && $.cookie('location_longitude')) {
            $('.location-name').html("附近");
        }else{
            $('.location-name').html("定位失败");
        }
        if ($.cookie('location_deniedName')){
            $('.location').html( $.cookie('location_deniedName'));
        }
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        定位的一个实例
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        new Location({
            businessType : "rent" ,
            cityApiUrl : this.apiUrl.common.getCityByLatLon ,
            identical : (position)=> {

            },
            investmentFlag:(Flag)=>{
              if (Flag.investment){
                 $('notopen-investment').show();
              }else {
                  $('notopen-investment').hide();
              }
            }
        });
        this.readyFun();
        let that = this;
        let cityid = 43;
        localStorage.cookieId = $.cookie('cookieId');
        cityid = ($.cookie('cityId') ?  $.cookie('cityId') : 43);  // 取cityId 默认为上海
        let url =  location.href.slice(0,location.href.lastIndexOf('/')+1);
        let conditionQuery = location.href.slice(location.href.lastIndexOf('/')+1,location.href.length);
        let conditionPath = location.pathname.slice(location.pathname.lastIndexOf('/')+1,location.pathname.length);
        let condition ='';  // condition字符串

        let queryString = '';// ?后面的参数
        let areasLineSting ='';  // ?后面参数 区域用到互斥
        let  conditionstr = "la-0"; // 默认的 condition 参数
        if (conditionPath == "") { // 判断路由后面的参数值  /rent , /rent/
            url = url
        } else if (conditionPath == "rent"){
            url = url+"rent/";
            conditionQuery = conditionQuery.slice(conditionQuery.indexOf('?'));
        }
        if (conditionQuery.indexOf('?') < 0) {  // ?后面没有参数的赋值
            condition = conditionQuery;
            console.log(condition+"meiyou?")
        }else {   // ?后面有参数的赋值
            condition = conditionQuery.slice(0,conditionQuery.indexOf('?'));
            queryString = conditionQuery.slice(conditionQuery.indexOf('?'));
           /* console.log(queryString+"231231");*/
            let queryObj = this.GetRequest();
            if (queryObj['districtId']){  // 查询？后面参数产出  后面区域板块用到（需要互斥）
                delete (queryObj['districtId'])
            }else if (queryObj['townId']){
                delete (queryObj['townId'])
            }else if (queryObj['subwayLine']){
                delete (queryObj['subwayLine'])
            }else if (queryObj['subwayStation']){
                delete (queryObj['subwayStation'])
            }else if (queryObj['subEstateId']){
                delete (queryObj['subEstateId'])
            }
            if(queryObj){
                areasLineSting ="?"+$.param(queryObj);
            }
        }
        let channelFlag = this.GetRequest()['channel'] || "";
        let conditionObject = this.parseCondition({condition:condition});  // 转成对象
        this.choseFun(conditionObject);

        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        请求接口 获取城市区域
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.request(this.apiUrl.rent.list.cityAreas,{houseType:3,cityId:cityid},{successCallback(data){
                if (data.status == 1){
                    let dataRes = data;
                    let dataDic = dataRes.data;
                    let dicAreas =''; // 区域标签拼接
                    let townList = '';// town标签拼接
                    let dataAreasName=''; // 中文区域名称
                    let dataAreasDi = '';
                    if (conditionObject["di"]){  // 有区域的渲染
                        $('.dic-content').show();
                         dicAreas = "<li>不限</li>";
                         dataDic.forEach(function (item) {   // 循环渲染城市
                            if (item.id == conditionObject["di"]){
                                dicAreas += `<li class="areas-subway" data-id ="${item.id}" data-di="di-${item.id}">${item.name}</li>`;
                                if (conditionObject["to"]){    // 是选择了town
                                    townList = "<li>不限</li>" ;
                                    item.townList.forEach(function (item) {
                                        if (item.id == conditionObject["to"]) {
                                            townList +=`<li class="chosed" data-id ="${item.id}" data-to="to-${item.id}">${item.name}</li>`;
                                            $('#dic>p').html(item.name) ;

                                        }else {
                                            townList +=`<li  data-id ="${item.id}" data-to="to-${item.id}">${item.name}</li>`
                                        }
                                    });
                                }else {  // 否选择了town
                                    townList = "<li class='chosed'>不限</li>";
                                    item.townList.forEach(function (item) {
                                            townList +=`<li  data-id ="${item.id}" data-to="to-${item.id}">${item.name}</li>`
                                    });
                                    dataAreasName = item.name;
                                    $('#dic>p').html(item.name);
                                }
                                dataAreasDi = "di-"+item.id
                            }else {
                                dicAreas += `<li data-id ="${item.id}" data-di="di-${item.id}">${item.name}</li>`
                            }
                        });
                        $('#dic').find('i').addClass('bacchosed');
                        $('#dic').addClass('chosed')
                    }else if (conditionObject["ne"]){
                        $('.location-name').addClass('areas-subway');
                        dicAreas = "<li>不限</li>";
                        dataDic.forEach(function (item) {   // 循环渲染城市
                            dicAreas += `<li data-id ="${item.id}" data-di="di-${item.id}">${item.name}</li>`
                        });
                        let locationData=["不限（智能范围)","500","1000","2000","5000"];
                        let locationList='';
                        locationData.forEach(function(item,index){
                            if(index == 0){
                                locationList = `<li data-ne='ne-5000'>${item}</li>`
                            }else{
                                if (conditionObject["ne"] == item){
                                    locationList+=`<li class="chosed" data-ne="ne-${item}">${item}米</li>`
                                }else {
                                    locationList+=`<li data-ne="ne-${item}">${item}米</li>`
                                }
                            }
                        });
                        $('#town').empty().append(locationList);
                        $('#dic').find('i').addClass('bacchosed');
                        $('#dic').addClass('chosed')
                    }else {
                         dicAreas = "<li class='areas-subway'>不限</li>";
                         dataDic.forEach(function (item) {   // 循环渲染城市
                                dicAreas += `<li data-id ="${item.id}" data-di="di-${item.id}">${item.name}</li>`
                        });
                    }
                    $('#dicAreas').append(dicAreas);
                    $('#town').append(townList);

                    $('#dicAreas>li').click(function () {           // 点击areas更换相应的town
                        let dataAreasId = $(this).attr("data-id");  // areas的id 后面循环对比需要
                            dataAreasDi = $(this).attr("data-di");  // 需要传给后台pinURL的参数  areas
                            dataAreasName = $(this).html();        // 获取中文区域名称
                        $(this).siblings().removeClass('areas-subway');
                        $(this).addClass('areas-subway');
                        if(dataAreasName == "不限") {
                            $('#dic>p').html("区域");
                            $('.bac').hide();
                            $('#dic').children('span').removeClass('direction');
                            $('#dic').find('i').removeClass('bacchosed');
                            $('#dic').removeClass('active-color-top');
                            $('#dic').removeClass('chosed');
                            $('.dic').slideToggle();
                            delete(conditionObject['di']);  // 删除areas的对象
                            delete(conditionObject['to']);  // 删除town的对象
                            delete(conditionObject['li']);  // 删除地铁线路的对象
                            delete(conditionObject['st']);  // 删除地铁线路的对象
                            delete(conditionObject['ne']);  // 删除附近
                            let conditionString = that.objectToString(conditionObject);
                            window.location.href = url + conditionString + areasLineSting;
                        }else if ($(this).attr("data-location") == "location"){
                            let locationData=["不限（智能范围)","500","1000","2000","5000"];
                            let locationList='';
                            locationData.forEach(function(item,index){
                                if(index == 0){
                                    locationList = `<li data-ne='ne-5000'>${item}</li>`
                                }else{
                                    locationList+=`<li data-ne="ne-${item}">${item}米</li>`
                                }
                            });
                             if ($(this).html() == "附近"){
                                 $('#town').empty().append(locationList);
                             }
                        } else {
                            dataDic.forEach(function (item) {    //
                                if (conditionObject["di"]){
                                  if (conditionObject["di"] == item.id && dataAreasId == item.id){
                                      if (conditionObject["to"]){
                                          townList ="<li>不限</li>" ;
                                          item.townList.forEach(function (item) {  // 循环渲染town
                                              if (conditionObject["to"] == item.id){
                                                  townList += `<li class="chosed" data-id ="${item.id}" data-to="to-${item.id}">${item.name}</li>`
                                              }else {
                                                  townList += `<li data-id ="${item.id}" data-to="to-${item.id}">${item.name}</li>`
                                              }
                                          });
                                      }else {
                                          townList ="<li class='chosed'>不限</li>" ;
                                          item.townList.forEach(function (item) {  // 循环渲染town
                                              townList += `<li data-id ="${item.id}" data-to="to-${item.id}">${item.name}</li>`
                                          });
                                      }
                                  }else {
                                      if(dataAreasId == item.id && item.townList){
                                          townList ="<li>不限</li>" ;
                                          item.townList.forEach(function (item) {  // 循环渲染town
                                              townList += `<li data-id ="${item.id}" data-to="to-${item.id}">${item.name}</li>`
                                          });
                                      }
                                  }
                                    $('#town').empty().append(townList);
                                }else {
                                    if(dataAreasId == item.id && item.townList){
                                        townList ="<li>不限</li>" ;
                                        item.townList.forEach(function (item) {  // 循环渲染town
                                            townList += `<li data-id ="${item.id}" data-to="to-${item.id}">${item.name}</li>`
                                        });
                                        $('#town').empty().append(townList);
                                    }
                                }
                            });
                        }
                    });
                      // town的点击获取
                    $('#town').on("click","li",function () {
                        $(this).siblings().removeClass('chosed');
                        $(this).addClass('chosed');
                        let dataTownId = $(this).attr("data-id");      // 站点的id
                        let dataTownTo =  $(this).attr("data-to");   // 需要传给后台pinURL的参数  town
                        let dataTownName = $(this).html();   // 获取中文town名称
                        delete(conditionObject['li']);  // 删除地铁线的对象
                        delete(conditionObject['st']);  // 删除地铁站点的对象、、、
                        if (dataTownName == "不限") {
                            $('#dic > p').html(dataAreasName);
                            let dataAreasDiObj =  that.parseCondition({condition:dataAreasDi});  // 转换成对象
                            $.extend(conditionObject,dataAreasDiObj); // 合并对象
                            delete(conditionObject['ne']);  // 删除附近
                            delete(conditionObject['to']);  // 删除town的对象
                            let conditionString = that.objectToString(conditionObject); // 转换成字符串
                            console.log(conditionString);
                            window.location.href = url + conditionString+areasLineSting;  // 跳转的URL
                        }else if($(this).attr("data-ne")){
                            let endMetres = $(this).attr("data-ne");
                            if($.cookie('location_latitude') && $.cookie('location_longitude')) {
                                delete(conditionObject['di']);
                                delete(conditionObject['to']);
                                let areasTownObj = that.parseCondition({condition: endMetres}); // 转换成对象
                                $.extend(conditionObject, areasTownObj);   // 合并对象
                                let conditionString = that.objectToString(conditionObject); // 转换成字符串
                                window.location.href = url + conditionString + areasLineSting;  // 跳转的URL
                            }else{
                                $('.location-name').html("定位失败")
                            }
                        } else {
                            $('#dic > p').html(dataTownName);
                            let areasTownString = dataAreasDi + '-' + dataTownTo;  // 字符串链接
                            delete(conditionObject['ne']);  // 删除附近
                            let areasTownObj = that.parseCondition({condition: areasTownString}); // 转换成对象
                            $.extend(conditionObject, areasTownObj);   // 合并对象
                            let conditionString = that.objectToString(conditionObject); // 转换成字符串
                            console.log(conditionString);
                            /*console.log(url + conditionString + areasLineSting)*/
                            window.location.href = url + conditionString + areasLineSting;  // 跳转的URL
                        }
                        $('.bac').hide();
                        $('#dic').children('span').removeClass('direction');
                        $('#dic').find('i').addClass('bacchosed');
                        $('#dic').addClass('chosed');
                        $('.dic').slideToggle();
                    })
                }
            }});
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        请求接口 获取地铁
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.request(this.apiUrl.rent.list.citySubway,{cityId:cityid},{successCallback(data){

                if (data.status == 1 &&  data.data.length) {
                    let dataRes = data;
                    let subwayLine = dataRes.data;
                    let metroLine = '';   // 定义地铁线路的标签拼接
                    let metroStation = ''; // 定义地铁站点的标签拼接
                    let dataLineName = '';  // 中文地铁线路名称
                    let dataLineLi = ''; // 地铁线路的字符串 li-id
                    subwayLine.forEach(function (item) {   // 循环渲染地铁线路
                        if (conditionObject['li'] && conditionObject['li'] == item.id) {
                            $('.dic-content').hide();
                            $('.metro-content').show();
                            $('.tabs > ul > li:eq(0)').removeClass('active-color-dic');
                            $('.tabs > ul > li:eq(1)').addClass('active-color-dic');
                            metroLine += `<li class="areas-subway" data-id ="${item.id}" data-li="li-${item.id}">${item.name}</li>`;
                            if (conditionObject['st']){
                                metroStation = "<li>不限</li>";
                                item.subList.forEach(function (itemSubList){
                                    if (conditionObject['st'] == itemSubList.id){
                                        metroStation += `<li  class='chosed' data-id ="${itemSubList.id}" data-st="st-${itemSubList.id}">${itemSubList.name}</li>`;
                                        $('#dic > p').html(itemSubList.name);
                                    }else {
                                        metroStation += `<li data-id ="${itemSubList.id}" data-st="st-${itemSubList.id}">${itemSubList.name}</li>`
                                    }
                                });
                            }else {
                                metroStation = "<li class='chosed'>不限</li>";
                                item.subList.forEach(function (itemSubList){
                                    metroStation += `<li data-id ="${itemSubList.id}" data-st="st-${itemSubList.id}">${itemSubList.name}</li>`;
                                });
                                dataLineName = item.name;
                                $('#dic > p').html(dataLineName);
                            }
                            dataLineLi = 'li-'+item.id;
                            $('#dic').find('i').addClass('bacchosed');
                            $('#dic').addClass('chosed')
                        }else {
                            metroLine += `<li data-id ="${item.id}" data-li="li-${item.id}">${item.name}</li>`
                        }
                    });
                    $('#metroStation').append(metroStation);
                    $('#metroLine').append(metroLine);
                    $('#metroLine > li').click(function () {   // 点击地铁线路更换相应的站点
                        let dataLineId = $(this).attr("data-id");  // 地铁线路的id 后面循环对比需要
                           dataLineLi = $(this).attr("data-li"); // 需要传给后台pinURL的参数  地铁线路
                           dataLineName = $(this).html();     // 获取中文地铁线路名称
                        $(this).siblings().removeClass('areas-subway');
                        $(this).addClass('areas-subway');
                        subwayLine.forEach(function (item) {
                                if (dataLineId == item.id && item.subList) {
                                    if(conditionObject['li'] == item.id && conditionObject['st']){
                                        metroStation = "<li>不限</li>";
                                        item.subList.forEach(function (item) { // 循环渲染地铁站点
                                            if (conditionObject['st'] == item.id){
                                                metroStation += `<li class="chosed"  data-id ="${item.id}" data-st="st-${item.id}">${item.name}</li>`
                                            }else {
                                                metroStation += `<li data-id ="${item.id}" data-st="st-${item.id}">${item.name}</li>`
                                            }
                                        });
                                    }else if(conditionObject['li'] == item.id && !conditionObject['st']){
                                        metroStation = "<li class='chosed'>不限</li>";
                                        item.subList.forEach(function (item) { // 循环渲染地铁站点
                                            metroStation += `<li data-id ="${item.id}" data-st="st-${item.id}">${item.name}</li>`
                                        });
                                    }else if ( conditionObject['li'] != item.id ){
                                        metroStation = "<li>不限</li>";
                                        item.subList.forEach(function (item) { // 循环渲染地铁站点
                                            metroStation += `<li data-id ="${item.id}" data-st="st-${item.id}">${item.name}</li>`
                                        });
                                    }

                                    $('#metroStation').empty().append(metroStation);
                                }
                        });
                    });
                    $('#metroStation ').on("click","li",function () {   // 站点的点击
                        $(this).siblings().removeClass('chosed');
                        $(this).addClass('chosed');
                        let dataStationId = $(this).attr("data-id");     //线路的id  dataStationId
                        let dataStationSt = $(this).attr("data-st");   // 需要传给后台pinURL的参数  站点
                        let dataStationName = $(this).html();  // 获取中文地铁站点名称
                        delete(conditionObject['di']);  // 删除areas的对象
                        delete(conditionObject['to']);  // 删除town的对象
                        delete(conditionObject['ne']);  // 删除附近
                        if ($(this).html() == "不限") {
                            $('#dic > p').html(dataLineName);  // 判断赋值给检索title
                            let dataLineLiObj = that.parseCondition({condition: dataLineLi}); // 转换成对象
                            $.extend(conditionObject, dataLineLiObj); // 合并对象
                            delete(conditionObject['st']);  // 删除站点的对象
                            let conditionString = that.objectToString(conditionObject);   // 转换成字符串
                            console.log(conditionString);
                            window.location.href = url + conditionString+areasLineSting;  // 跳转的URL
                        } else {
                            $('#dic > p').html(dataStationName); // 判断赋值给检索title
                            let lineStationString =  dataLineLi+ '-' + dataStationSt; // 合并字符串
                            let lineStationObj = that.parseCondition({condition: lineStationString}); // 转换成对象
                            $.extend(conditionObject, lineStationObj); // 合并对象
                            let conditionString = that.objectToString(conditionObject); // 转换成字符串
                            window.location.href = url + conditionString+areasLineSting; // 跳转的URL
                        }
                        $('.bac').hide();
                        $('#dic').children('span').removeClass('direction');
                        $('#dic').find('i').addClass('bacchosed');
                        $('#dic').addClass('chosed');
                        $('.dic').slideToggle();
                    })
                }else {
                    $('.subway').hide();
                }
            }});

        this.firstGivePage(conditionObject);

        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        租房价格点击选择函数
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $('.price-list > ul >li').click(function () {
            $(this).siblings().removeClass('chosed');
            $(this).addClass('chosed');
            $('.bac').hide();
            $('#price').children('span').removeClass('direction');
            delete(conditionObject['cp']);  // 删除价格参数的对象
            if ($(this).html() == '不限'){
                $('#price>p').html("租金");
                $('#price').find('i').removeClass('bacchosed');
                $('#price').removeClass('active-color-top');
                $('#price').removeClass('chosed');
                delete(conditionObject['pr']);  // 删除价格参数的对象
                let conditionString = that.objectToString(conditionObject); // 对象转换成字符串
                console.log(conditionString);
                window.location.href = url + conditionString+queryString; // 跳转的URL
            }else {
                $('#price>p').html($(this).html().replace(/\s|\xA0/g,""));
                $('#price').find('i').addClass('bacchosed');
                $('#price').addClass('active-color-top');
                let dataPrice = $(this).attr("data-pr");
                let dataPriceObj = that.parseCondition({condition: dataPrice}); // 转换成对象
                $.extend(conditionObject, dataPriceObj); // 合并对象
                let conditionString = that.objectToString(conditionObject); // 转换成字符串
                window.location.href = url + conditionString+ queryString; // 跳转的URL
            }
            $('.price-total').slideToggle();
        });
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        租房价格自定义函数
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $('#selfPrConf').click(function (event) {
            event.preventDefault();
            let lowPr = $('#lowPr').val();
            let topPr=  $('#topPr').val();
                $('.wrong').hide();
                if(lowPr && topPr){
                    if (parseInt(lowPr) > parseInt(topPr)) {
                        $('.wrong').show();
                        setTimeout(function () {
                            $('.wrong').hide();
                        },2000)}else {
                        $('#price>p').html(lowPr+'-'+topPr);
                        $('#price').find('i').addClass('bacchosed');
                        $('#price').addClass('active-color-top');
                        delete(conditionObject['pr']);  // 删除价格选择的参数的对象
                        let cp = {"cp":lowPr+"to"+topPr};
                        $.extend(conditionObject, cp); // 合并对象
                        let conditionString = that.objectToString(conditionObject); // 转换成字符串
                        console.log(conditionString);
                        window.location.href = url + conditionString+ queryString; // 跳转的URL
                        $('.bac').hide();
                        $('#price').children('span').removeClass('direction');
                        $('.price-total').slideToggle();
                    }
                } else{
                    if (lowPr == '' && topPr){
                        $('#price>p').html(topPr+'以下');
                        $('#price').find('i').addClass('bacchosed');
                        $('#price').addClass('active-color-top');
                        delete(conditionObject['pr']);  // 删除价格选择的参数的对象
                        let cp = {"cp":"0"+"to"+topPr};
                        $.extend(conditionObject, cp); // 合并对象
                        let conditionString = that.objectToString(conditionObject); // 转换成字符串
                        console.log(conditionString);
                        window.location = url + conditionString+ queryString; // 跳转的URL
                    } else if(topPr == '' && lowPr){
                        $('#price>p').html(lowPr+'以上');
                        $('#price').find('i').addClass('bacchosed');
                        $('#price').addClass('active-color-top');
                        delete(conditionObject['pr']);  // 删除价格选择的参数的对象
                        let cp = {"cp":lowPr+"to"+"0"};
                        $.extend(conditionObject, cp); // 合并对象
                        let conditionString = that.objectToString(conditionObject); // 转换成字符串
                        console.log(conditionString);
                        window.location.href = url + conditionString + queryString; // 跳转的URL
                    }else {
                        $('#price>p').html("租金");
                        $('#price').find('i').removeClass('bacchosed');
                        $('#price').removeClass('active-color-top');
                        $('#price').removeClass('chosed');
                        delete(conditionObject['pr']);  // 删除价格选择的参数的对象
                        delete(conditionObject['cp']);  // 删除价格自定义参数的对象
                        let conditionString = that.objectToString(conditionObject); // 转换成字符串
                        console.log(conditionString);
                        window.location.href = url + conditionString + queryString; // 跳转的URL
                    }
                    $('.bac').hide();
                    $('#price').children('span').removeClass('direction');
                    $('.price-total').slideToggle();
                }
        });
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        房型传参
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $('#moreComf').click(function () {
            let tag = $('.more-spec > ul >li');  // 四个tag标签的选择
            let area = $('.area > ul >li');    // 面价的标签的选择
            let decoration = $('.decoration > ul >li'); // 装修的标签的选择
            let houseList = $('.house-list  > ul > li ');  // 获取房型标签
            let rentWay = $('.rent-way  > ul > li ');  // 租赁方式
            let tagString = ''; //四个tag 字符串的组装
            let areaString = '';  // 面积的选择的字符串的组装
            let decorationString = ''; // 装修的状况的字符串的组装
            let decorationArray = [];  // 装修 临时使用数组
            let rentWayString = ''; // 租赁方式 字符串
            let rentWayObj={}; // 租赁方式 对象
            let tagObj = {};  // 标签对象
            let areaObj = {}; // 面积 对象
            let decorationObj = {}; //
            let areaArray = [];
            let houseListString = '';
            let houseListArray = [];
            let noHouseListArray = [];
            let houseListObj = {};
            // 对选中房型的处理
            houseList.each(function (index, item) {   // 判断是否房型被选中
                if (item.classList.length == 1) {
                    houseListArray.push(index)
                } else {
                    noHouseListArray.push(index)
                }
            });
            if (houseListArray.length > 0) {
                houseListArray.forEach(function (item, index) {
                    if (index == 0) {
                        houseListString = $(`.house-list  > ul > li:eq(${item})`).attr('data-la');
                    } else {
                        houseListString = houseListString + '-' + $(`.house-list  > ul > li:eq(${item})`).attr('data-la');
                    }
                });
                houseListObj = that.parseCondition({condition: houseListString}); // 转换成对象
            }
            // 选中标签的处理
            tag.each(function (index, item) {
                if (item.classList.length == 1) { // 根据标签样式判断是否有选择
                    if (index == 0) {
                        tagString = "ta-1"
                    } else {
                        tagString = tagString + '-' + "ta-1"
                    }
                } else {
                    if (index == 0) {
                        tagString = "ta-0"
                    } else {
                        tagString = tagString + '-' + "ta-0"
                    }
                }
            });
            // 选中面积的处理
            area.each(function (index, item) {
                if (item.classList.length == 1) {
                    areaArray.push(index)
                }
            });
            if (areaArray.length > 0) {
                areaArray.forEach(function (item, index) {
                    if (index == 0) {
                        areaString = $(`.area > ul >li:eq(${item})`).attr('data-ar')
                    } else {
                        areaString = areaString + "-" + $(`.area > ul >li:eq(${item})`).attr('data-ar')
                    }
                })
            }
            // 选中装修的处理
            decoration.each(function (index, item) {
                if (item.classList.length == 1) {    // 判断哪些有样式 建立数组
                    decorationArray.push(index);
                }
            });
            if (decorationArray.length > 0) {
                decorationArray.forEach(function (item, index) {
                    if (index == 0) {
                        decorationString = $(`.decoration > ul >li:eq(${item})`).attr('data-dt')
                    } else {
                        decorationString = decorationString + '-' + $(`.decoration > ul >li:eq(${item})`).attr('data-dt')
                    }
                });
            }
            // 选中租赁方式的处理
            rentWay.each(function(index,item){
                if (item.classList.length == 1) {    // 判断哪些有样式
                    rentWayString = $(`.rent-way  > ul > li:eq(${index})`).attr('data-rw');
                }
            });

            if(rentWayString){
                delete(conditionObject['er']);
                delete(conditionObject['fs']);
                rentWayObj = that.parseCondition({condition: rentWayString});
            }else{
                delete(conditionObject['er']);
                delete(conditionObject['fs'])
            }
            if (tagString) {
                tagObj = that.parseCondition({condition: tagString});
            } else {
                delete(conditionObject['ta'])
            }
            if (areaString) {
                areaObj = that.parseCondition({condition: areaString});
            } else {
                delete(conditionObject['ar'])
            }
            if (decorationString) {
                decorationObj = that.parseCondition({condition: decorationString});
            } else {
                delete(conditionObject['dt'])
            }
            if (areaObj['ar'] || decorationObj['dt'] || tagObj['ta'] || !(noHouseListArray.length == 5 && houseListArray[0]== 0) || rentWayString) {
                $('#type').find('i').addClass('bacchosed');
                $("#type").removeClass('active-color-top');
                $("#type").addClass('chosed')
            } else {
                $('#type').find('i').removeClass('bacchosed');
                $("#type").removeClass('active-color-top');
                $("#type").removeClass('chosed')
            }
            $('.bac').hide();
            $('#type').children('span').removeClass('direction');
            $('.type').slideToggle();
            $.extend(conditionObject, houseListObj, tagObj, areaObj, decorationObj , rentWayObj); // 合并对象
            let conditionString = that.objectToString(conditionObject); // 转换成字符串
            window.location.href = url + conditionString + queryString; // 跳转的URL
        });
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        排序
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        if (conditionObject['so']){
            let sortChose = $('.sort-chose>ul>li');
            let soSting =  that.objectToString({'so':conditionObject['so']}); // 转换成字符串
            sortChose.each(function (index,item) {
                if (soSting == $(`.sort-chose>ul>li:eq(${index})`).attr('data-so')){
                    $(`.sort-chose>ul>li:eq(${index})`).siblings().removeClass('chosed');
                    $(`.sort-chose>ul>li:eq(${index})`).addClass('chosed')
                }
            });
            if (soSting != 'so-0') {
                $('#sortTop').find('i').addClass('bacchosed');
                $('#sortTop').addClass('chosed');
            }else {
                $('#sortTop').find('i').removeClass('bacchosed');
                $('#sortTop').removeClass('chosed');
            }
        }
        $('.sort-chose>ul>li').click(function () {
            $('.bac').css({'z-index': '10', 'top': '4.5rem'});
            $('.bac').hide();
            $(this).siblings().removeClass('chosed');
            $(this).addClass('chosed');
            $('.sort-chose').slideToggle();
            let soString =  $(this).attr('data-so');
            if(soString != 'so-0'){
                $('#sortTop').find('i').addClass('bacchosed');
                $("#sortTop").removeClass('active-color-top');
                $("#sortTop").addClass('chosed')
            }else{
                $('#sortTop').find('i').removeClass('bacchosed');
                $("#sortTop").removeClass('active-color-top');
                $("#sortTop").removeClass('chosed')
            }
            let soObj = that.parseCondition({condition:soString});
            $.extend(conditionObject, soObj); // 合并对象
            let conditionString = that.objectToString(conditionObject); // 转换成字符串
            console.log(conditionString);
            window.location.href = url + conditionString+ queryString; // 跳转的URL
        });


        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        清除搜索条件   无房源列表的情况
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

        $('.clearOption').click(function () {
            window.location.href = url+areasLineSting ;
        });

        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        上拉加载 注册
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.pullData(condition,cityid);


        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        搜索框的点击：
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        require(['../components/list-search.min'],function(listSearch){
            listSearch.init(that);
            listSearch.searchInputClick(channelFlag,conditionObject,url,areasLineSting,cityid);
        });
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        右侧滑出选项：
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $('.icon-hanbao').click(function () {
            $('.bac').css({'z-index': '16', 'top': '0'});
            $('.bac').show();
            $('.slide-right').show();
            $('.slide-right').animate({right:'0'});

        });

        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        页面埋点
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        require(['../components/bigdata.min'],function(BigData){
            BigData.init(that);
            BigData.bigData({
                "pageName": "1202",
                "channel":channelFlag ,
                "type": 1
            });
        });

           /*阻止事件冒泡*/
        $('.writ-price').click(function (event) {
            event.stopPropagation()
        });
        $('.price-list > ul').scroll(function (event) {
            event.stopPropagation()
        })
    }

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    条件选择的初始化函数
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    readyFun() {
        setTimeout(function () {
            $('.total-num').hide();
            $('.all-control').css("margin-top","8.5rem");
        },1500);
        $('.content-hight').height($(window).height()*0.7 - $('.tabs').height());
    }

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    条件选择的区域选择的点击效果函数
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    choseFun(conditionObject) {
        let self = this;
        let scrollTop = $(window).scrollTop();
        /* 检索选择点击事件*/
        $('.rent-list > ul > li').click(function () {
            $(this).siblings().removeClass('active-color-top');
            $(this).toggleClass('active-color-top');
            let listI =  $('.rent-list > ul > li > span >i');  // 获取检索箭头的  i标签
            listI.each(function (index, item) {     // 循环i标签（下箭头）是否有样式为蓝色，是代表用户选取了数据，否代表没有选取
                if (item.classList.length == 1){
                    $(`.rent-list > ul > li:eq(${index})`).addClass('chosed');
                }else {
                    $(`.rent-list > ul > li:eq(${index})`).removeClass('chosed');
                }
            });
            $(this).siblings().children('span').removeClass('direction');
            /*点击li标签事件改变子标签span箭头的样式（后面会选中条件查询之后恢复指向）*/
            $(this).children('span').toggleClass('direction');
            /*let list = $('.rent-list > ul > li > span');  // 获取检索当中的span标签   后面判断指向 （根据class判断指向）*/
            if ($(window).scrollTop()){
                scrollTop = $(window).scrollTop();
            }
             if ($(this).children('span').hasClass('direction')){
                 $('.bac').show();
                 $('body').addClass('noscroll');
             }else {
                 $('.bac').hide();
                 $('body').removeClass('noscroll');
                 if (scrollTop){
                     $(window).scrollTop(scrollTop);
                 }
             }
    /*        $('.bac').hide();
             $('body').removeClass('noscroll');
            $(window).scrollTop(scrollTop);
            list.each(function (index, item) {   //根据span标签的样式指向判断底部罩层是否显示
                if (item.classList.length == 1) {
                    scrollTop = $(window).scrollTop();
                    $('.bac').show();
                    $('body').addClass('noscroll');
                    console.log('dasjh'+scrollTop);
                  /!*  $(window).scrollTop(scrollTop)*!/
                }
            });*/
            let indexP = $(this).index();
            /*根据点击li标签的位置判断相应的模块响应出现*/
            if (indexP == 0) {     /*判断区域模块的显示*/
                $('.dic').stop();
                $('.price-total').hide();
                $('.house-type').hide();
                $('.sort-chose').hide();
                $('.dic').slideToggle("fast");
            } else if (indexP == 1) {      /*判断价格模块的显示*/
                $('.bac').stop();
                $('.dic').hide();
                $('.house-type').hide();
                $('.sort-chose').hide();
                $('.price-total').slideToggle("fast");
            } else if (indexP == 2) {    /* 判断户型模块显示*/
                $('.bac').stop();
                $('.dic').hide();
                $('.price-total').hide();
                $('.sort-chose').hide();
                $('.house-type').slideToggle("fast");
            } else if (indexP == 3) {    /* 判断更多模块显示*/
                $('.bac').stop();
                $('.dic').hide();
                $('.price-total').hide();
                $('.house-type').slideUp();
                $('.sort-chose').slideToggle("fast");
            }
            $('.bac').css({'z-index': '10', 'top': '4.5rem'});
            self.firstGivePage(conditionObject);
        });
        /*区域与地铁选择点击事件*/
        $('.tabs > ul > li').click(function () {
            $(this).siblings().removeClass('active-color-dic');
            $(this).addClass('active-color-dic');
            let indexP = $(this).index();
            if (indexP == 0) {      /*判断区域模块显示或隐藏*/
                $('.metro-content').hide();
                $('.dic-content').slideDown();
            } else if (indexP == 1) {   /*判断地铁模块显示或隐藏*/
                $('.dic-content').hide();
                $('.metro-content').slideDown();
            }
        });
        /*更多 标签的点击*/
        $('.more-spec > ul >li').click(function () {
            $(this).toggleClass('active-house');
        });
        /*更多 面积的点击*/
        $('.area > ul >li').click(function () {
            $(this).toggleClass('active-house');
        });
        /*更多 装修的点击*/
        $('.decoration > ul >li').click(function () {
            $(this).toggleClass('active-house');
        });
        /* 房型选择点击事件*/
        $('.house-list > ul > li').click(function () {
            let indexP = $(this).index();
            if (indexP == 0) {
                $(this).siblings().removeClass('active-house');
                $(this).addClass('active-house');
            } else {
                $(this).toggleClass('active-house');
                let houseList  = $('.house-list > ul > li');
                let houseListArray  =[];
                houseList.each(function (index, item ) {
                    if (item.classList.length == 1){
                       if (index == 0){
                           $('.house-list > ul > li:eq(0)').removeClass('active-house');
                       }
                    }else {
                        houseListArray.push(index)
                    }
                });
                if (houseListArray.length > 5){
                    $('.house-list > ul > li:eq(0)').addClass('active-house');
                }
            }
        });
        /*底部罩层点击之后还原*/
        $('.bac').click(function () {
            $('.dic').slideUp();
            $('.price-total').slideUp();
            $('.house-type').slideUp();
            $('.more').slideUp();
            $('.rent-list > ul > li').children('span').removeClass('direction');
            $('.rent-list > ul > li').removeClass('active-color-top');
            $('.bac').hide().css({'z-index': '10', 'top': '4.5rem'});
            $('.slide-right').animate({right:'-50%'}).hide();
            $('.sort-chose').hide();
            $('body').removeClass('noscroll');
            $(window).scrollTop(scrollTop)
        });
        /*更多模块的重置搜索*/
        $('#cancelMore').click(function () {
            $('.more-spec > ul >li').removeClass('active-house');
            $('.area > ul >li').removeClass('active-house');
            $('.decoration > ul >li').removeClass('active-house');
            $('.rent-way > ul >li').removeClass('active-house');
            $(`.house-list>ul>li:eq(0)`).addClass('active-house');
            $(`.house-list>ul>li:eq(0)`).siblings().removeClass('active-house')
        });
        /*租赁方式的点击样式*/
        $('.rent-way > ul > li').click(function(){
            $(this).addClass('active-house');
            $(this).siblings().removeClass('active-house')
        })
    }

    /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    首次渲染 所选择的条件
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
    firstGivePage(conditionObject) {
        let self = this;
        // 租房房型初次选中渲染
        if (conditionObject['la']) {
            let conditionPr = $('.house-list>ul>li');
            let laString = '';
            let numberD = [0,1,2,3,4,5];
            if (conditionObject['la'].length > 1) {
                conditionObject['la'].forEach(function (item) {
                    $(`.house-list>ul>li:eq(${item})`).addClass('active-house');
                    numberD.forEach(function (itemN,indexN) {
                        if (item == itemN){
                            numberD.splice(indexN,1);
                        }
                    })
                });
                numberD.forEach(function (item) {
                    $(`.house-list>ul>li:eq(${item})`).removeClass('active-house');
                });
               /* $('#type >p').html('多选');*/
                $('#type').find('i').addClass('bacchosed');
                $('#type').addClass('chosed');
            } else {
             /*   if (conditionObject['la'] == 0){
                    $('#type >p').html('户型');
                    $('#type').find('i').removeClass('bacchosed');
                    $('#type').removeClass('chosed');
                }else {
                    $('#type >p').html($(`.house-list>ul>li:eq(${conditionObject['la']})`).html());
                    $('#type').find('i').addClass('bacchosed');
                    $('#type').addClass('chosed');
                }*/
                $(`.house-list>ul>li:eq(${conditionObject['la']})`).addClass('active-house');
                $(`.house-list>ul>li:eq(${conditionObject['la']})`).siblings().removeClass('active-house');
            }
        }else {
            $(`.house-list>ul>li:eq(0)`).addClass('active-house');
            $(`.house-list>ul>li:eq(0)`).siblings().removeClass('active-house')
        }

        // 租房价格初次选中渲染
        if (conditionObject['pr']) {
            let conditionPr = $('.price-list>ul>li');
            let conditionString = self.objectToString({"pr": conditionObject['pr']}); // 对象转换成字符串
            conditionPr.each(function (index, item) {
                if (conditionString == $(`.price-list>ul>li:eq(${index})`).attr('data-pr')) {
                    $(`.price-list>ul>li:eq(${index})`).addClass('chosed');
                    $('#price>p').html($(`.price-list>ul>li:eq(${index})`).html().replace(' - ', '-'));
                    $('#price').find('i').addClass('bacchosed');
                    $('#price').addClass('chosed');
                }
            });
        } else if (conditionObject['cp']) {
            let cityArray = conditionObject['cp'].split('to');
            if (cityArray[0] != 0 && cityArray[1] != 0) {
                $('#lowPr').val(cityArray[0]);
                $('#topPr').val(cityArray[1]);
                $('#price>p').html(cityArray[0] + '-' + cityArray[1]);
            } else if (cityArray[0] == 0 && cityArray[1] != 0) {
                $('#topPr').val(cityArray[1]);
                $('#price>p').html(cityArray[1] + '以下');
            } else if (cityArray[0] != 0 && cityArray[1] == 0) {
                $('#lowPr').val(cityArray[0]);
                $('#price>p').html(cityArray[0] + '以上');
            }
            $('#price').find('i').addClass('bacchosed');
            $('#price').addClass('chosed');
        } else {
            $(`.price-list>ul>li:eq(0)`).addClass('chosed');
        }


        let taString =  "ta-0-ta-0-ta-0-ta-0-ta-0-ta-0" ;
        if (conditionObject['ta']){
           taString = self.objectToString({'ta':conditionObject['ta']}); // 对象转换成字符串
        }
        if (taString != "ta-0-ta-0-ta-0-ta-0-ta-0-ta-0" || conditionObject['ar'] || conditionObject['dt'] || (conditionObject['la'] && conditionObject['la']!= "0") || conditionObject['er'] || conditionObject['fs']){
            $('#type').find('i').addClass('bacchosed');
            $('#type').addClass('chosed');
        }else {
            $('#type').find('i').removeClass('bacchosed');
            $('#type').removeClass('chosed');
        }
        // 租房更多的tag 初次选中渲染
        if (conditionObject['ta']) {
            conditionObject['ta'].forEach(function (item, index) {
                if (item == 1) {
                    $(`.more-spec > ul >li:eq(${index})`).addClass('active-house')
                }else {
                    $(`.more-spec > ul >li:eq(${index})`).removeClass('active-house')
                }
            })
        }else {
            $('.more-spec > ul >li').removeClass('active-house')
        }
        //面积 初次选中渲染
        if (conditionObject['ar']) {
            let numberD = [0,1,2,3,4,5,6];
            if (conditionObject['ar'].length > 1){
                conditionObject['ar'].forEach(function (item,index) {
                    $(`.area>ul>li:eq(${item})`).addClass('active-house');
                    numberD.forEach(function (itemD,indexD) {
                        if (item  == itemD){
                            numberD.splice(indexD,1);
                        }
                    })
                })
            }else {
                $(`.area>ul>li:eq(${conditionObject['ar']})`).addClass('active-house');
                numberD.forEach(function (itemD,indexD) {
                    if (conditionObject['ar']  == itemD){
                        numberD.splice(indexD,1);
                    }
                })
            }
            numberD.forEach(function (item) {
                $(`.area>ul>li:eq(${item})`).removeClass('active-house')
            })
        }else {
            $('.area>ul>li').removeClass('active-house')
        }
        //装修 初次选中渲染
        if (conditionObject['dt']) {
            let numberD = [1,2,3,4,5];
            if (conditionObject['dt'].length>1){
                conditionObject['dt'].forEach(function (item, index) {
                    $(`.decoration> ul >li:eq(${item -1})`).addClass('active-house');
                    numberD.forEach(function (itemD,indexD) {
                        if (item  == itemD){
                            numberD.splice(indexD,1);
                        }
                    })
                });
            }else {
                $(`.decoration> ul >li:eq(${conditionObject['dt'] -1})`).addClass('active-house');
                numberD.forEach(function (itemD,indexD) {
                    if (conditionObject['dt']  == itemD){
                        numberD.splice(indexD,1);
                    }
                })
            }
            numberD.forEach(function (item) {
                $(`.decoration> ul >li:eq(${item -1})`).removeClass('active-house');
            })
        }else {
            $('.decoration> ul >li').removeClass('active-house');
        }
        /*租房方式的首次渲染*/
        if (conditionObject['fs']){
            $('.rent-way > ul >li:eq(1)').addClass('active-house')
        }
        if (conditionObject['er']){
            $('.rent-way > ul >li:eq(0)').addClass('active-house')
        }
    }
    /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    获取并解析路由中(:condition)部分成一个Object
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

    parseCondition({ condition , separator = "-" }) {
        let result = {} ;
        if( ! condition) return result ;
        let partArray = condition.split(separator) ;
        if( partArray.length === 1 ) return partArray[0] ;
        partArray.forEach(( part , index )=>{
            let val = (partArray.length < index + 2) ? "" : partArray[index+1] ;
            if( index % 2 == 0 ) {
                if( ! result.hasOwnProperty(part)) result[part] = val ;
                else {
                    if( result[part].constructor != Array) result[part] = [result[part]] ;
                    result[part].push(val) ;
                }
            }
        }) ;
        return result ;
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     把对象处理成字符串
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    objectToString(obj) {
        let conditionKeyArray = [];
        let conditionValueArray =[];
            for(let key in obj) {
                conditionKeyArray.push(key);
                conditionValueArray.push(obj[key]);
            }
        let conditionString = '';
        conditionKeyArray.forEach((itemUp, index) => {
            if (index == 0) {
                if (conditionValueArray[index].constructor == Array){
                    conditionValueArray[index].forEach(function (item,index) {
                        if (index == 0){
                            conditionString = itemUp + '-'+ item
                        }else {
                            conditionString = conditionString + '-'+ itemUp + '-'+ item
                        }

                    })
                }else {
                    conditionString = itemUp + '-' + conditionValueArray[index]
                }

            } else {
                if (conditionValueArray[index].constructor == Array){
                    conditionValueArray[index].forEach(function (item,index) {
                            conditionString = conditionString + '-'+ itemUp + '-'+ item
                    })
                }else {
                    conditionString = conditionString + '-' + itemUp + '-' + conditionValueArray[index]
                }
            }
        });
        return conditionString
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     创建dome
   -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

    creatRent(conditionObject,channel,item){
        let houseTag=[];
        let houseTagList = '';
        let commision ='';
        if (item.houseTag.isSubwayHouse) {
           /* houseTag.push("近地铁");*/
            houseTagList += '<span class="tag nears">近地铁</span>'
        }  if (item.houseTag.isPriceDown) {
          /*  houseTag.push("降价")*/
            houseTagList += '<span class="tag priced">降价</span>'
        }  if (item.houseTag.isNewHouse) {
           /* houseTag.push("新上")*/
            houseTagList += '<span class="tag newup">新上</span>'
        }   if (item.houseTag.isShortRent) {
            /*houseTag.push("可短租")*/
            houseTagList += '<span class="tag anthert">可短租</span>'
        }   if(item.houseTag.isHardcover == 1){
            /*houseTag.push("精装")*/
            houseTagList += '<span class="tag anthert">精装</span>'
        } if(item.houseTag.isHardcover == 2){
            /*houseTag.push("豪装")*/
            houseTagList += '<span class="tag anthert">豪装</span>'
        } if(item.houseTag.isSouth){
            /*houseTag.push("朝南")*/
            houseTagList += '<span class="tag anthert">朝南</span>'
        } if(item.houseTag.isZeroCommission){
            /*houseTag.push("0佣金")*/
            commision= ' <span class="commission">0 佣金</span>'
        }
        let hasVideo='';
        if(item.houseTag.hasVideo == 1){
            hasVideo= `<span class="play"><i></i></span>`;
        }
        let distanceSubway = '';
        let styleNo = '';
        if (item.distanceSubway != null){
            distanceSubway = `<p class="base-info">${item.distanceSubway}</p>`
        }else {
            styleNo=`style="margin-top: 0.75rem"`
        }
        let bigdata = encodeURIComponent(JSON.stringify({ eventName:'1202039',eventParam:{rent_house_id:item.houseId }, channel:channel || "", type: 2}));
        let domeRent=  `<a  class="rent-item box" href=" ${item.url}" data-bigdata="${bigdata}">
            <div class="left">
                <img src="${item.firstImageUrl}?x-oss-process=image/resize,w_120" alt="${ item.estateName} " class="lazy">
                ${hasVideo}
                ${commision}
            </div>
            <div class="right">
                <h4> ${item.houseTitle}</h4>
                <p class="base-info">                    
                   ${item.houseTypeStr} ${item.spaceArea}㎡ | ${item.districtAndTownName}
                </p>
                ${distanceSubway}
                <p class="tags" ${styleNo}>${houseTagList}</p>
                <p class="unit-price"> <span>${item.rentPriceStr}</span> 元/月</p>
            </div>
        </a>`;
        return domeRent
    }

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     上拉加载实例化
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    pullload(conditionObject,channel) {
        let self = this ;
        let pinyin = $.cookie('pinyin') || "shanghai";
        //租房列表
        $(".rent-items").pullload({
            apiUrl : this.apiUrl.rent.list.rentHouseList ,
            requestType: "post",
            queryStringObject : conditionObject ,
            traditional: true,
            pageSize: 10,
            threshold : 50 ,
            callback : function(data) {
                if( ! data.data) return ;
                $.each(data.data , (index , rent)=> {
                    rent.url = "/"+pinyin+"/rent/" + rent.encryptHouseId + ".html" ;
                    $(".rent-items").append(self.creatRent(conditionObject,channel,rent)) ;
                }) ;
            }
        }) ;

    } ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     上拉加载参数组装
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    pullData(condition,cityid) {
        let conditionData={};
        if (condition) {
            let conditionObj =  this.parseCondition({condition:condition});
            let spaceAreaStart =["0-50","50-70","70-90","90-110","110-130","130-150","150-200","200-300","300-0"];
            conditionData = {
                "cityId":cityid,
                "bedRoomSumLists":[ ],
                "renovations":[],
                "spaceAreas":[]
            };
            if (conditionObj['di']){ // 区域选择
                conditionData["districtId"] =conditionObj['di']
            }
            if(conditionObj['to']){   //town的获取赋值给接口需要的参数
                conditionData['townId'] = conditionObj['to'];
            }
            if (conditionObj['li']){  //地铁线路
                conditionData['subwayLine'] = conditionObj['li'];
            }
            if (conditionObj['st']){  // 地铁站点
                conditionData['subwayStation'] = conditionObj['st'];
            }
            if (conditionObj['la']){   // 房型检索条件
                if (  conditionObj['la'].constructor == Array) {
                    conditionData['bedRoomSumLists'] = conditionObj['la'];
                } else {
                    conditionObj['la'] == 0 ? conditionData['bedRoomSumLists'] = [] : conditionData['bedRoomSumLists'].push(conditionObj['la']);
                }
            }
            if (conditionObj['pr'] ){   // 价格选择
                if( conditionObj['pr'].constructor == Array) {
                    conditionData["rentPriceStart"]= conditionObj['pr'][0];
                    conditionData["rentPriceEnd"]= conditionObj['pr'][1]
                }else {
                    conditionData["rentPriceStart"]= conditionObj['pr']
                }
            }
            if (conditionObj['cp']){  // 价格自定义
                let cpArray = conditionObj['cp'].split("to");
                conditionData["rentPriceStart"]= cpArray[0];
                conditionData["rentPriceEnd"]= cpArray[1]
            }
            if (conditionObj['ta']){
                conditionData["isZeroCommission"] = conditionObj['ta'][0];  // 0佣金 0 否  1 是
                conditionData["isSubWay"] = conditionObj['ta'][1];  // 近地铁 0 任意  1 是
                conditionData["priceDown"] = conditionObj['ta'][2]; // 降价  0 否  1 是
                conditionData["isNewOnStore"] = conditionObj['ta'][3]; // 新上 0：否 1：是，
                conditionData["isShortRent"] = conditionObj['ta'][4]; // 新上 0：否 1：是，
                conditionData["orientation"] = conditionObj['ta'][5]; // 房屋朝向 1南北通透 0任意
            }
            if (conditionObj['ar']) {   // 面积选择
                if(conditionObj['ar'].constructor == Array) {
                    conditionObj['ar'].forEach(function (item) {
                        conditionData['spaceAreas'].push(spaceAreaStart[item])
                    });
                }else {
                    conditionData['spaceAreas'].push(spaceAreaStart[conditionObj['ar']])
                }
            }
            if (conditionObj['dt']) {   // 装修状况
                if (conditionObj['dt'].constructor == Array){
                    conditionData["renovations"] = conditionObj['dt'];
                }else {
                    conditionData["renovations"].push(conditionObj['dt']);
                }
            }
            if (conditionObj['so']) {  // 排序
                conditionData["orderType"] = conditionObj['so'];
            }
            if (conditionObj['ne']) { // 附近
                conditionData["endMetres"] = conditionObj['ne'];
                conditionData["localLon"] = $.cookie('location_longitude');
                conditionData["localLat"] = $.cookie('location_latitude');
            }
            if (conditionObj['er']) { // 租赁方式 整租
                conditionData["isEntire"] = conditionObj['er'];
            }
            if (conditionObj['fs']) { // 租赁方式 合租
                conditionData["isShared"] = conditionObj['fs'];
            }
        }else {
            conditionData = {
                "cityId":cityid,
            };
        }
        let channel="";
        if (this.GetRequest()['districtId']) {  // 查询？后面参数异步请求
            conditionData['districtId'] = this.GetRequest()['districtId'];
        } if (this.GetRequest()['townId']){
            conditionData['townId'] = this.GetRequest()['townId'];
        } if (this.GetRequest()['subwayLine']){
            conditionData['subwayLine'] = this.GetRequest()['subwayLine'];
        } if (this.GetRequest()['subwayStation']){
            conditionData['subwayStation'] = this.GetRequest()['subwayStation'];
        } if (this.GetRequest()['subEstateId']){
            conditionData['subEstateId'] = this.GetRequest()['subEstateId'];
        } if (this.GetRequest()['channel']){
             channel = this.GetRequest()['channel'];
        }
        this.pullload(conditionData,channel);  // 上拉加载的 函数注册
    };

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
    new ListController;
});