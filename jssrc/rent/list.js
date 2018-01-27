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
        new Location({
            businessType : "rent" ,
            cityApiUrl : this.apiUrl.common.getCityByLatLon ,
            identical : (position)=> {
                console.log(position) ;
            }
        }) ;
        this.readyFun();
        let that = this;
        let cityid = 43;
        localStorage.cookieId = $.cookie('cookieId');
        $.cookie('cityId') ?  cityid = $.cookie('cityId') : cityid = 43;
        let url =  location.href.slice(0,location.href.lastIndexOf('/')+1);
        let conditionQuery = location.href.slice(location.href.lastIndexOf('/')+1,location.href.length);
        let condition ='';  // condition字符串
        let valueSearch =''; // 检索的value值
        let queryString = '';// ?后面的参数
        let areasLineSting ='';  // ?后面参数 区域用到互斥
        let  conditionstr = "la-0"; // 默认的 condition 参数
        let acWordHouseList ='';  // 联想词
        if (conditionQuery == "") {
            url = url
        }
        if (conditionQuery.indexOf('?') < 0) {  // ?后面没有参数的赋值
            condition = conditionQuery;
        }else {   // ?后面有参数的赋值
            condition = conditionQuery.slice(0,conditionQuery.indexOf('?'));
            if (condition == " "){
                condition = conditionstr
            }
            queryString = conditionQuery.slice(conditionQuery.indexOf('?'));
            let queryObj = this.GetRequest();
            if (queryObj['districtId']){  // 查询？后面参数产出  后面区域板块用到
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
        let conditionObject = this.parseCondition({condition:condition});  // 转成对象
        console.log(JSON.stringify(conditionObject)+"conditionObject");
        this.choseFun(conditionObject,url,acWordHouseList);
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        请求接口 获取城市区域
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.request(this.apiUrl.rent.list.cityAreas,{houseType:3,cityId:cityid},{successCallback(data){
                if (data.status == 1){
                    let dataRes = data;
                    let dataDic = dataRes.data;
            /*        console.log(dataDic);*/
                    let dicAreas ='';
                    let townList = '';
                    let dataAreasName='';
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
                            dataAreasName = $(this).html();        // 获取中文地铁线路名称
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
                            let conditionString = that.objectToString(conditionObject);
                            window.location.href = url + conditionString + areasLineSting;
                        }else {
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
                                          $('#town').empty();
                                          $('#town').append(townList);
                                      }else {
                                          townList ="<li class='chosed'>不限</li>" ;
                                          item.townList.forEach(function (item) {  // 循环渲染town
                                              townList += `<li data-id ="${item.id}" data-to="to-${item.id}">${item.name}</li>`
                                          });
                                          $('#town').empty();
                                          $('#town').append(townList);
                                      }
                                  }else {
                                      if(dataAreasId == item.id && item.townList){
                                          townList ="<li>不限</li>" ;
                                          item.townList.forEach(function (item) {  // 循环渲染town
                                              townList += `<li data-id ="${item.id}" data-to="to-${item.id}">${item.name}</li>`
                                          });
                                          $('#town').empty();
                                          $('#town').append(townList);
                                      }
                                  }
                                }else {
                                    if(dataAreasId == item.id && item.townList){
                                        townList ="<li>不限</li>" ;
                                        item.townList.forEach(function (item) {  // 循环渲染town
                                            townList += `<li data-id ="${item.id}" data-to="to-${item.id}">${item.name}</li>`
                                        });
                                        $('#town').empty();
                                        $('#town').append(townList);
                                    }
                                }
                            });
                            $('#town >li').click(function () {  // town的点击获取
                                $(this).siblings().removeClass('chosed');
                                $(this).addClass('chosed');
                                let dataTownId = $(this).attr("data-id");      // 站点的id
                                let dataTownTo =  $(this).attr("data-to");   // 需要传给后台pinURL的参数  town
                                let dataTownName = $(this).html();   // 获取中文town名称
                                delete(conditionObject['li']);  // 删除地铁线的对象
                                delete(conditionObject['st']);  // 删除地铁站点的对象
                                if (dataTownName == "不限") {
                                    $('#dic > p').html(dataAreasName);
                                    let dataAreasDiObj =  that.parseCondition({condition:dataAreasDi});  // 转换成对象
                                    Object.assign(conditionObject,dataAreasDiObj); // 合并对象
                                    delete(conditionObject['to']);  // 删除town的对象
                                    let conditionString = that.objectToString(conditionObject); // 转换成字符串
                                    console.log(conditionString);
                                    window.location.href = url + conditionString+areasLineSting;  // 跳转的URL
                                } else {
                                    $('#dic > p').html(dataTownName);
                                    let areasTownString = dataAreasDi + '-' + dataTownTo;  // 字符串链接
                                    let areasTownObj = that.parseCondition({condition: areasTownString}); // 转换成对象
                                    Object.assign(conditionObject, areasTownObj);   // 合并对象
                                    let conditionString = that.objectToString(conditionObject); // 转换成字符串
                                    console.log(conditionString);
                                    window.location.href = url + conditionString+areasLineSting;  // 跳转的URL
                                }
                                $('.bac').hide();
                                $('#dic').children('span').removeClass('direction');
                                $('#dic').find('i').addClass('bacchosed');
                                $('#dic').addClass('chosed');
                                $('.dic').slideToggle();
                            })

                        }
                    });
                    // 再次渲染时用到的点击事件
                    $('#town >li').click(function () {  // town的点击获取
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
                            Object.assign(conditionObject,dataAreasDiObj); // 合并对象
                            delete(conditionObject['to']);  // 删除town的对象
                            let conditionString = that.objectToString(conditionObject); // 转换成字符串
                            console.log(conditionString);
                            window.location.href = url + conditionString+areasLineSting;  // 跳转的URL

                        } else {
                            $('#dic > p').html(dataTownName);
                            let areasTownString = dataAreasDi + '-' + dataTownTo;  // 字符串链接
                            let areasTownObj = that.parseCondition({condition: areasTownString}); // 转换成对象
                            Object.assign(conditionObject, areasTownObj);   // 合并对象
                            let conditionString = that.objectToString(conditionObject); // 转换成字符串
                            console.log(conditionString);
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

                    let metroLine = '';
                    let metroStation = '';
                    let dataLineName = '';
                    let dataLineLi = '';
                    subwayLine.forEach(function (item) {   // 循环渲染地铁线路
                        if (conditionObject['li'] && conditionObject['li'] == item.id) {
                            $('.dic-content').hide();
                            $('.metro-content').show();
                            $('.tabs > ul > li:eq(0)').removeClass('active-color-dic');
                            $('.tabs > ul > li:eq(1)').addClass('active-color-dic');
                            metroLine += `<li class="areas-subway" data-id ="${item.id}" data-li="li-${item.id}">${item.name}</li>`;
                            if (conditionObject['st']){
                                metroStation = "<li>不限</li>";
                                item.subList.forEach(function (item){
                                    if (conditionObject['st'] == item.id){
                                        metroStation += `<li  class='chosed' data-id ="${item.id}" data-st="st-${item.id}">${item.name}</li>`;
                                        $('#dic > p').html(item.name);
                                    }else {
                                        metroStation += `<li data-id ="${item.id}" data-st="st-${item.id}">${item.name}</li>`
                                    }
                                });
                            }else {
                                metroStation = "<li class='chosed'>不限</li>";
                                item.subList.forEach(function (item){
                                    metroStation += `<li data-id ="${item.id}" data-st="st-${item.id}">${item.name}</li>`;
                                });
                                dataLineName = item.name;
                                $('#dic > p').html(item.name);
                                dataLineLi = 'li-'+item.id
                            }
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
                            if (conditionObject['li']){
                                if ( conditionObject['li'] == item.id && dataLineId == item.id){
                                    if (conditionObject['st']){
                                        metroStation = "<li>不限</li>";
                                        item.subList.forEach(function (item) { // 循环渲染地铁站点
                                            if (conditionObject['st'] == item.id){
                                                metroStation += `<li class="chosed"  data-id ="${item.id}" data-st="st-${item.id}">${item.name}</li>`
                                            }else {
                                                metroStation += `<li data-id ="${item.id}" data-st="st-${item.id}">${item.name}</li>`
                                            }
                                        });
                                        $('#metroStation').empty();
                                        $('#metroStation').append(metroStation);
                                    }else {
                                        metroStation = "<li class='chosed'>不限</li>";
                                        item.subList.forEach(function (item) { // 循环渲染地铁站点
                                            metroStation += `<li data-id ="${item.id}" data-st="st-${item.id}">${item.name}</li>`
                                        });
                                        $('#metroStation').empty();
                                        $('#metroStation').append(metroStation);
                                    }
                                }else {
                                    if (dataLineId == item.id && item.subList) {
                                        metroStation = "<li>不限</li>";
                                        item.subList.forEach(function (item) { // 循环渲染地铁站点
                                            metroStation += `<li data-id ="${item.id}" data-st="st-${item.id}">${item.name}</li>`
                                        });
                                        $('#metroStation').empty();
                                        $('#metroStation').append(metroStation);
                                    }
                                }
                            }else {
                                if (dataLineId == item.id && item.subList) {
                                    metroStation = "<li>不限</li>";
                                    item.subList.forEach(function (item) { // 循环渲染地铁站点
                                        metroStation += `<li data-id ="${item.id}" data-st="st-${item.id}">${item.name}</li>`
                                    });
                                    $('#metroStation').empty();
                                    $('#metroStation').append(metroStation);
                                }
                            }


                        });

                        $('#metroStation > li').click(function () {   // 站点的点击
                            $(this).siblings().removeClass('chosed');
                            $(this).addClass('chosed');
                            let dataStationId = $(this).attr("data-id");     // 站点的id
                            let dataStationSt = $(this).attr("data-st");   // 需要传给后台pinURL的参数  站点
                            let dataStationName = $(this).html();  // 获取中文地铁站点名称
                            delete(conditionObject['di']);  // 删除areas的对象
                            delete(conditionObject['to']);  // 删除town的对象
                            if ($(this).html() == "不限") {
                                $('#dic > p').html(dataLineName);  // 判断赋值给检索title
                                let dataLineLiObj = that.parseCondition({condition: dataLineLi}); // 转换成对象
                                Object.assign(conditionObject, dataLineLiObj); // 合并对象
                                delete(conditionObject['st']);  // 删除站点的对象
                                let conditionString = that.objectToString(conditionObject);   // 转换成字符串
                                console.log(conditionString);
                                window.location.href = url + conditionString+areasLineSting;  // 跳转的URL
                            } else {
                                $('#dic > p').html(dataStationName); // 判断赋值给检索title
                                let lineStationString =  dataLineLi+ '-' + dataStationSt; // 合并字符串
                                let lineStationObj = that.parseCondition({condition: lineStationString}); // 转换成对象
                                Object.assign(conditionObject, lineStationObj); // 合并对象
                                let conditionString = that.objectToString(conditionObject); // 转换成字符串
                                console.log(conditionString);
                                window.location.href = url + conditionString+areasLineSting; // 跳转的URL
                            }
                            $('.bac').hide();
                            $('#dic').children('span').removeClass('direction');
                            $('#dic').find('i').addClass('bacchosed');
                            $('#dic').addClass('chosed');
                            $('.dic').slideToggle();
                        })
                    });

                    $('#metroStation > li').click(function () {   // 站点的点击
                      /*  $(this).siblings().removeClass('chosed');
                        $(this).addClass('chosed');*/
                        let dataStationId = $(this).attr("data-id");     // 站点的id
                        let dataStationSt = $(this).attr("data-st");   // 需要传给后台pinURL的参数  站点
                        let dataStationName = $(this).html();  // 获取中文地铁站点名称
                        delete(conditionObject['di']);  // 删除areas的对象
                        delete(conditionObject['to']);  // 删除town的对象
                        if ($(this).html() == "不限") {
                            $('#dic > p').html(dataLineName);  // 判断赋值给检索title
                            let dataLineLiObj = that.parseCondition({condition: dataLineLi}); // 转换成对象
                            Object.assign(conditionObject, dataLineLiObj); // 合并对象
                            delete(conditionObject['st']);  // 删除站点的对象
                            let conditionString = that.objectToString(conditionObject);   // 转换成字符串
                            console.log(conditionString);
                            window.location.href = url + conditionString+areasLineSting;  // 跳转的URL
                        } else {
                            $('#dic > p').html(dataStationName); // 判断赋值给检索title
                            let lineStationString = "li-"+ conditionObject['li'] + '-' + dataStationSt; // 合并字符串
                            console.log(lineStationString+"lineStationString");
                            let lineStationObj = that.parseCondition({condition: lineStationString}); // 转换成对象
                            Object.assign(conditionObject, lineStationObj); // 合并对象
                            let conditionString = that.objectToString(conditionObject); // 转换成字符串
                            console.log(conditionString);
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

        this.firstGivePage(conditionObject,this);

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
                Object.assign(conditionObject, dataPriceObj); // 合并对象
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
                        Object.assign(conditionObject, cp); // 合并对象
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
                        Object.assign(conditionObject, cp); // 合并对象
                        let conditionString = that.objectToString(conditionObject); // 转换成字符串
                        console.log(conditionString);
                        window.location = url + conditionString+ queryString; // 跳转的URL
                    } else if(topPr == '' && lowPr){
                        $('#price>p').html(lowPr+'以上');
                        $('#price').find('i').addClass('bacchosed');
                        $('#price').addClass('active-color-top');
                        delete(conditionObject['pr']);  // 删除价格选择的参数的对象
                        let cp = {"cp":lowPr+"to"+"0"};
                        Object.assign(conditionObject, cp); // 合并对象
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
         $('#houseCmfir').click(function () {
             let houseList =  $('.house-list  > ul > li ');  // 获取房型标签
             let houseListString = '';
             let houseListArray = [];
             let noHouseListArray = [];
                 houseList.each(function (index,item) {   // 判断是否房型被选中
                 if (item.classList.length == 1) {
                     houseListArray.push(index)
                 }else {
                     noHouseListArray.push(index)
                 }
             });
             if (houseListArray.length > 0){
                 houseListArray.forEach(function (item,index) {
                     if (index == 0) {
                         houseListString = $(`.house-list  > ul > li:eq(${item})`).attr('data-la');
                     }else {
                         houseListString = houseListString +'-'+$(`.house-list  > ul > li:eq(${item})`).attr('data-la');
                     }
                 });
                 if(houseListArray.length == 1){  // 判断单选的情况下是不限 还是有具体房型
                     if ($(`.house-list  > ul > li:eq(${houseListArray[0]})`).html() == '不限'){
                         $('#type >p').html('户型');
                     }else {
                         let houseTitle =  $(`.house-list  > ul > li:eq(${houseListArray[0]})`).html();
                         $('#type >p').html(houseTitle);
                         $('#type').find('i').addClass('bacchosed');
                     }
                 }else {
                     $('#type >p').html('多选');
                     $('#type').find('i').addClass('bacchosed');
                 }
                 let houseListObj = that.parseCondition({condition: houseListString}); // 转换成对象
                 Object.assign(conditionObject, houseListObj); // 合并对象
                 let conditionString = that.objectToString(conditionObject); // 转换成字符串
                 console.log(conditionString);
                 console.log(url + conditionString);
                 window.location.href = url + conditionString + queryString; // 跳转的URL
             } if (noHouseListArray.length == 5 && houseListArray[0]== 0) {
                 $('#type').find('i').removeClass('bacchosed');
                 $('#type').removeClass('active-color-top');
                 $('#type').removeClass('chosed');
             }
             $('.bac').hide();
             $('#type').children('span').removeClass('direction');
             $('.house-type').slideToggle();
         });
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        更多选择
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $('#moreComf').click(function () {
            let tag = $('.more-spec > ul >li');
            let area = $('.area > ul >li');
            let decoration = $('.decoration > ul >li');
            let tagString='';
            let areaString= '';
            let decorationString ='';
            let decorationArray =[];
            let moreDta={};
            let  tagObj={};
            let areaObj={};
            let decorationObj = {};
            let areaArray = [];
            tag.each(function (index,item) {
                if(item.classList.length == 1){ // 根据标签样式判断是否有选择
                    if(index == 0) {
                        tagString = "ta-1"
                    }else {
                        tagString  = tagString +'-'+"ta-1"
                    }
                }
                else {
                    if(index == 0) {
                        tagString = "ta-0"
                    }else {
                        tagString = tagString +'-'+"ta-0"
                    }
                }
            });
            area.each(function (index,item) {
                if(item.classList.length == 1){
                    areaArray.push(index)
                }
            });
            if (areaArray){
                if (areaArray.length >1){
                    areaArray.forEach(function (item,index) {
                        if (index == 0){
                            areaString = $(`.area > ul >li:eq(${item})`).attr('data-ar')
                        }else {
                            areaString = areaString +"-"+$(`.area > ul >li:eq(${item})`).attr('data-ar')
                        }
                    })
                }else {
                    areaString = $(`.area > ul >li:eq(${areaArray[0]})`).attr('data-ar')
                }
            }
            decoration.each(function (index,item) {
                if(item.classList.length == 1){    // 判断哪些有样式 建立数组
                    decorationArray.push(index);
                }
            });
            if (decorationArray.length > 1){
                decorationArray.forEach(function (item,index) {
                    if (index ==0){
                        decorationString = $(`.decoration > ul >li:eq(${item})`).attr('data-dt')
                    }else {
                        decorationString  = decorationString + '-'+ $(`.decoration > ul >li:eq(${item})`).attr('data-dt')
                    }
                });
            }else {
                decorationString = $(`.decoration > ul >li:eq(${decorationArray[0]})`).attr('data-dt')
            }
            if (tagString){
                tagObj  = that.parseCondition({condition: tagString});
            }else {
                delete(conditionObject['ta'] )
            }
            if(areaString){
                areaObj = that.parseCondition({condition: areaString});
            }else {
                delete(conditionObject['ar'] )
            }
            if (decorationString){
                decorationObj = that.parseCondition({condition: decorationString});
            }else {
                delete(conditionObject['dt'])
            }
            console.log(tagString+'tagString');
            Object.assign(moreDta, tagObj, areaObj, decorationObj); // 合并对象
            if (areaObj['ar'] || decorationObj['dt'] || tagObj['ta']){
                $('#more').find('i').addClass('bacchosed');
                $("#more").removeClass('active-color-top');
                $("#more").addClass('chosed')
            }else {
                $('#more').find('i').removeClass('bacchosed');
                $("#more").removeClass('active-color-top');
                $("#more").removeClass('chosed')
            }
            $('.bac').hide();
            $('#more').children('span').removeClass('direction');
            $('.more').slideToggle();
            Object.assign(conditionObject, tagObj,areaObj,decorationObj); // 合并对象
            let conditionString = that.objectToString(conditionObject); // 转换成字符串
            console.log(url + conditionString);
            window.location.href = url + conditionString+ queryString; // 跳转的URL
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
                $('.sort').addClass('sort-change')
            }else {
                $('.sort').removeClass('sort-change')
            }
        }
        $('.sort-chose>ul>li').click(function () {
            $('.bac').css({'z-index': '10', 'top': '4.5rem'});
            $('.bac').hide();
            $(this).siblings().removeClass('chosed');
            $(this).addClass('chosed');
            $('.sort-chose').slideToggle();
            let soString =  $(this).attr('data-so');
            let soObj = that.parseCondition({condition:soString});
            console.log(soObj);
            Object.assign(conditionObject, soObj); // 合并对象
            let conditionString = that.objectToString(conditionObject); // 转换成字符串
            console.log(conditionString);
            window.location.href = url + conditionString+ queryString; // 跳转的URL
        });
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        搜索 联想词
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

        $('#searchInput').on('keyup input',function (event) {
            if ($(this).val()) {
                $('.conone').show();
                $('.have-result').hide();
                let saveLocalStorage = [];
                let sendData={
                    key:$(this).val(),
                    cityId:cityid,
                    pageName:"renthouselist"
                };
               /* 埋点的参数*/
               let bigdata =encodeURIComponent(JSON.stringify({
                   eventName: '1203004',
                   type: 2
               }));
                 that.request(that.apiUrl.rent.list.acWord,sendData,{successCallback(data){
                         let renthouselistData = data.data;
                         acWordHouseList = renthouselistData.secondHouseList;
                         if (renthouselistData.secondHouseList) {
                             $('.show-result').show();
                             $('.no-result').hide();
                             $('.search-result').show();
                             let titleName ='';
                             let addreName = '';
                             let searchaAcWord = '';
                             renthouselistData.secondHouseList.forEach(function (item,index) {  // 循环出搜索结果
                                 titleName = item.estateDesc.replace(item.markname,`<span>${item.markname}</span>`);
                                 addreName = item.address.replace(item.markname,`<span>${item.markname}</span>`);
                                 if (index == 0){
                                     searchaAcWord = `<li data-bigdata="${bigdata} " data-type="${item.type}" data-value="${item.value}" data-name="${item.estateDesc}" data-address="${item.address}"><p>${titleName}</p><span>${addreName}</span></li>`
                                 }else {
                                     searchaAcWord = searchaAcWord +`<li data-bigdata="${bigdata} " data-type="${item.type}" data-value="${item.value}" data-name="${item.estateDesc}" data-address="${item.address}"><p>${titleName}</p><span>${addreName}</span></li>`
                                 }
                             }) ;
                             $('#showResult').empty();
                             $('#showResult').append(searchaAcWord);
                         } else {
                             $('.no-result').show();
                             $('.show-result').hide();
                         }
                         // 搜索条目点击跳转 和储存
                         $('#showResult >li').click(function () {
                             JSON.parse( localStorage.getItem('searchHistory')) ?  saveLocalStorage = JSON.parse( localStorage.getItem('searchHistory')) : saveLocalStorage = [];
                             let singleData={
                                 "key":$(this).attr('data-name'),
                                 "id": $(this).attr('data-value'),
                                 "address": $(this).attr('data-address'),
                                 "type":$(this).attr('data-type'),
                             };
                             if (saveLocalStorage.length >4){
                                 saveLocalStorage.reverse().splice(4)
                             }

                             let saveLocal= saveLocalStorage.reverse();
                             saveLocal.push(singleData);
                             localStorage.setItem("searchHistory",JSON.stringify(saveLocal));
                             delete (conditionObject['di']); delete (conditionObject['to']);
                             delete (conditionObject['li']); delete (conditionObject['st']);
                             let conditionString = that.objectToString(conditionObject); // 转换成字符串
                             valueSearch = $(this).attr('data-value');
                             let typeS = $(this).attr('data-type');
                             window.location.href = url + conditionString + that.checkType(typeS,valueSearch);
                         });
                     }});
                 if (acWordHouseList){
                     if (event.keyCode == 13){ //enter存值  ta-0-ta-0-ta-0-ta-0-la-0
                         JSON.parse( localStorage.getItem('searchHistory')) ?  saveLocalStorage = JSON.parse( localStorage.getItem('searchHistory')) : saveLocalStorage = [];
                         let singleData={
                             "key":$('#showResult>li:eq(0)').attr('data-name'),
                             "id": $('#showResult>li:eq(0)').attr('data-value'),
                             "address": $('#showResult>li:eq(0)').attr('data-address'),
                             "type":$('#showResult>li:eq(0)').attr('data-type'),
                         };
                         if (saveLocalStorage.length >4){
                             saveLocalStorage.reverse().splice(4)
                         }
                         let saveLocal= saveLocalStorage.reverse();
                         saveLocal.push(singleData);
                         localStorage.setItem("searchHistory",JSON.stringify(saveLocal));
                         delete (conditionObject['di']); delete (conditionObject['to']);
                         delete (conditionObject['li']); delete (conditionObject['st']);
                         let conditionString = that.objectToString(conditionObject); // 转换成字符串
                         valueSearch = $('#showResult>li:eq(0)').attr('data-value');
                         let typeS = $('#showResult>li:eq(0)').attr('data-type');
                         that.checkType(typeS,valueSearch);
                         window.location.href = url + conditionString + that.checkType(typeS,valueSearch);
                     }
                 }

            }
        });
        /* 删除搜索框并跳转*/
        $('.contwo').click(function () {
            $('#searchInput').val('');
            $('.icon-close').hide();
            $('#showResult').empty();
            /*$('.have-result').show();*/
            $('.no-result').hide();
             $('.have-result').hide();
            let conditionString = that.objectToString(conditionObject); // 转换成字符串
             window.location.href = url + conditionString + areasLineSting
        });
         /*删除搜索框不跳转*/
        $('.conone').click(function () {
            $('#searchInput').val('');
            $('.icon-close').hide();
            $('#showResult').empty();
            /*$('.have-result').show();*/
            $('.no-result').hide();
            if (JSON.parse(localStorage.getItem('searchHistory'))) {  // Storage取值渲染
                $('.have-result').show();
            }else {
                $('.have-result').hide();
            }
        });
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        搜索初步渲染
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        if (JSON.parse(localStorage.getItem('searchHistory')) && this.haveNot() ) {
            let firtName = JSON.parse(localStorage.getItem('searchHistory')).reverse()[0].key;
            $('#searchInput').val(firtName);
            $('.contwo').show();
        }
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        清除搜索
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

        $('.clearOption').click(function () {
            let conditionString = that.objectToString(conditionObject); // 转换成字符串
            window.location.href = url +conditionstr+areasLineSting ;
        });

        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        对参数转译成服务端需要的参数
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

        let conditionData={};
        if (condition) {
            let conditionString = condition;
            let newConditionString  = conditionString.replace("to","townId").replace("li","subwayLine").replace("st","subwayStation");
            let conditionObj =  that.parseCondition({condition:newConditionString});
            let spaceAreaStart =["0-50","50-70","70-90","90-110","110-130","130-150","150-0"];
            conditionData = {
                 "cityId":cityid,
                 "bedRoomSumLists":[ ],
                 "renovations":[],
                 "spaceAreas":[]
            };
            if(conditionObj['la'] && conditionObj['la'].length == 1){  // 判断是对象还是数组
                if(conditionObj['la'] == 0){
                    conditionData['bedRoomSumLists'] =[ ];
                }else {
                    conditionData['bedRoomSumLists'].push(conditionObj.la)
                }
            }else {
                conditionData['bedRoomSumLists'] = conditionObj['la']
            }
            delete(conditionObj['la']);
            if (conditionObj['pr']) {   // 价格选择
                if(conditionObj['pr'].constructor == Array) {
                    conditionData["rentPriceStart"]= conditionObj['pr'][0];
                    conditionData["rentPriceEnd"]= conditionObj['pr'][1]
                }else {
                    conditionData["rentPriceStart"]= conditionObj['pr']
                }
            }
            delete(conditionObj['pr']);
            if (conditionObj['cp']){  // 价格自定义
                let cpArray = conditionObj['cp'].split("townId");
                    conditionData["rentPriceStart"]= cpArray[0];
                    conditionData["rentPriceEnd"]= cpArray[1]
            }
            delete(conditionObj['cp']);
            if (conditionObj['ta']){
                conditionData["isSubWay"] = conditionObj['ta'][0];  // 近地铁 0 任意  1 是
                conditionData["priceDown"] = conditionObj['ta'][1]; // 降价  0 否  1 是
                conditionData["isNewOnStore"] = conditionObj['ta'][2]; // 新上 0：否 1：是，
                conditionData["orientation"] = conditionObj['ta'][3]; // 房屋朝向 1南北通透 0任意
            }
            delete(conditionObj['ta']);
            if (conditionObj['ar']) {   // 面积选择
                if(conditionObj['ar'].length == 1) {
                    conditionData['spaceAreas'].push(spaceAreaStart[conditionObj['ar']])
                }else {
                    conditionObj['ar'].forEach(function (item) {
                        conditionData['spaceAreas'].push(spaceAreaStart[item])
                    });
                }
            }
            delete(conditionObj['ar']);
            if (conditionObj['dt']) {
                if (conditionObj['dt'].length == 1){
                    conditionData["renovations"].push(conditionObj['dt'])
                }else {
                    conditionData["renovations"] = conditionObj['dt'];   // 装修状况
                }

            }
            delete(conditionObj['dt']);
            if (conditionObj['so']) {
                conditionData["orderType"] = conditionObj['so'];   // 装修状况
            }
            delete(conditionObj['so']);
            if (conditionObj['di']){
                conditionData["districtId"] =conditionObj['di']
            }
            delete(conditionObj['di']);
            if (this.GetRequest()['districtId']){  // 查询？后面参数异步请求
                conditionData['districtId'] = this.GetRequest()['districtId'];
            }else if (this.GetRequest()['townId']){
                conditionData['townId'] = this.GetRequest()['townId'];
            }else if (this.GetRequest()['subwayLine']){
                conditionData['subwayLine'] = this.GetRequest()['subwayLine'];
            }else if (this.GetRequest()['subwayStation']){
                conditionData['subwayStation'] = this.GetRequest()['subwayStation'];
            }else if (this.GetRequest()['subEstateId']){
                conditionData['subEstateId'] = this.GetRequest()['subEstateId'];
            }
            Object.assign(conditionData,conditionObj) ;
        }else {
            conditionData = {
                "cityId":cityid,
            };
            if (this.GetRequest()['districtId']){  // 查询？后面参数异步请求
                conditionData['districtId'] = this.GetRequest()['districtId'];
            }else if (this.GetRequest()['townId']){
                conditionData['townId'] = this.GetRequest()['townId'];
            }else if (this.GetRequest()['subwayLine']){
                conditionData['subwayLine'] = this.GetRequest()['subwayLine'];
            }else if (this.GetRequest()['subwayStation']){
                conditionData['subwayStation'] = this.GetRequest()['subwayStation'];
            }else if (this.GetRequest()['subEstateId']){
                conditionData['subEstateId'] = this.GetRequest()['subEstateId'];
            }
        }

        this.pullload(conditionData);

        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        判断是否为今日头条
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        if (this.GetRequest()['channel'] == "jrttsub"){
            $('.rent-list').css({"box-shadow":" 0 0 0 0 rgba(0,0,0,.15)","background-color":"#fff"});
          /*  $('.input-kw-form').css({"background-color":"#F8F8F8"});*/
            $('.search-input').css('width',"96%");
            /*$('.icon-search').css('left','6.6rem');*/
            $('.history-name').hide();
            $('.icon-fanhui').hide();
            $('.sort').hide();
            if ($('#searchInput').val()){
                $('.conone').show();
            }else {
                $('.conone').hide();
            }
           $('.cancel-channel').click(function () {
               $(this).hide();
               $('.contwo').hide();
               $('.conone').hide();
               $('.all-control').removeClass('on-hide');
               $('.search-result').hide();
               $('.no-result').hide();
               $('.back').hide();
               $('.show-result').hide();
               $('#searchInput').val('');
               $('.location-all').show();
               $('#searchInput').css({"background-color":"#F8F8F8",'width':"52%"});
               $('.rent-search').siblings('ul').removeClass('on-hide');
               $('.rent-search').removeClass('active-search-channel');
           });
           $('.location-all').click(function () {
               $.cookie('citySelectionOpen', 1 ,{path: '/',});
           })
        }else {
            $('.input-kw-form').css({"background-color":"#FFF"});
            $('.location-all').hide();
            $('.sort').show();
            $('.icon-hanbao').show();
        }

        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        阻止表单的默认行为：
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $('.input-kw-form').submit(function(event){
            event.preventDefault();
        });

        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        搜索框的点击：
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $('#searchInput').click(function () {
            $('.rent-search').siblings('ul').addClass('on-hide');
            $('.all-control').addClass('on-hide');
            $('.search-result').show();
            $('.show-result').hide();
            $('.icon-hanbao').hide();
            if ($('#searchInput').val()){
                $('.conone').show();
            }else {
                $('.conone').hide();
            }
            if (that.GetRequest()['channel'] == "jrttsub"){
                $('.rent-search').addClass('active-search-channel');
                $('.cancel-channel').show();
                $('.location-all').hide();
                $('#searchInput').css({"background-color":"#F8F8F8",'width':"100%"});
            }else {
                $('.input-kw-form').css({"background-color":"#f0f0f0"});
                $('.rent-search').addClass('active-search');
                $('.back').hide();
                $('.fanhui').show();
                $('.contwo').hide();
            }
            $('body').css('background-color','#F0F0F0');

            if (JSON.parse(localStorage.getItem('searchHistory')) && !acWordHouseList) {  // Storage取值渲染
                $('.have-result').show();
                let searchHistory = JSON.parse(localStorage.getItem('searchHistory')).reverse();
                let listSearchHistory = '';
                /* 埋点的参数*/
                let bigdata =encodeURIComponent(JSON.stringify({
                    eventName: '1203005',
                    type: 2
                }));
                searchHistory.forEach(function (item,index) {
                    if (index == 0){
                        listSearchHistory = `<li data-bigdata="${bigdata} " data-type="${item.type}" data-value="${item.id}" data-name="${item.key}" data-address="${item.address}"><p>${item.key}</p><span>${item.address}</span></li>`
                    }else {
                        listSearchHistory = listSearchHistory + `<li data-bigdata="${bigdata} " data-type="${item.type}" data-value="${item.id}" data-name="${item.key}" data-address="${item.address}"><p>${item.key}</p><span>${item.address}</span></li>`
                    }
                });
                $('#resultHistory').empty();
                $('#resultHistory').append(listSearchHistory);
                // 历史搜索点击
                $('#resultHistory >li').click(function () {
                    let saveLocalStorage =[];
                    JSON.parse( localStorage.getItem('searchHistory')) ?  saveLocalStorage = JSON.parse( localStorage.getItem('searchHistory')) : saveLocalStorage = [];
                    let ind =$(this).index();
                    let singleData = {
                        "key":$(this).attr('data-name'),
                        "id": $(this).attr('data-value'),
                        "address": $(this).attr('data-address'),
                        "type":$(this).attr('data-type'),

                    };
                    saveLocalStorage.forEach(function (item,index) {
                        if (item.id == singleData.id){
                            saveLocalStorage.splice(index,1)
                        }
                    });
                    saveLocalStorage.push(singleData);
                    localStorage.setItem("searchHistory",JSON.stringify(saveLocalStorage));
                    delete (conditionObject['di']); delete (conditionObject['to']);
                    delete (conditionObject['li']); delete (conditionObject['st']);
                    let conditionString = that.objectToString(conditionObject); // 转换成字符串
                    let valueSearch = $(this).attr('data-value');
                    let typeS = $(this).attr('data-type');
                    window.location.href = url + conditionString + that.checkType(typeS,valueSearch);
                });
            }else {
                $('.show-result').show();
                $('.have-result').hide();
            }
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
    条件选择的初始化函数  padding-top: 1.5rem;
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
    choseFun(conditionObject,url,acWordHouseList) {
        let self = this;
            /* 条件选择点击事件*/
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
            let list = $('.rent-list > ul > li > span');  // 获取检索当中的span标签   后面判断指向 （根据class判断指向）
            $('.bac').hide();
            if(self.GetRequest()['channel'] == "jrttsub"){
                $('#sort').hide();
            }else {
                $('#sort').show();
            }
            list.each(function (index, item) {   //根据span标签的样式指向判断底部罩层是否显示
                if (item.classList.length == 1) {
                    $('.bac').show();
                    $('#sort').hide();
                }else {
                   /* $('body').css('position','static')*/
                }
            });
            let indexP = $(this).index();
            /*alert("indexP"+indexP);*/
            /*根据点击li标签的位置判断相应的模块响应出现*/
            if (indexP == 0) {     /*判断区域模块的显示*/
                $('.dic').stop();
                $('.price-total').hide();
                $('.house-type').hide();
                $('.more').hide();
                $('.dic').slideToggle("fast");
            } else if (indexP == 1) {      /*判断价格模块的显示*/
                $('.bac').stop();
                $('.dic').hide();
                $('.house-type').hide();
                $('.more').hide();
                $('.price-total').slideToggle("fast");
            } else if (indexP == 2) {    /* 判断户型模块显示*/
                $('.bac').stop();
                $('.dic').hide();
                $('.price-total').hide();
                $('.more').hide();
                $('.house-type').slideToggle("fast");
            } else if (indexP == 3) {    /* 判断更多模块显示*/
                $('.bac').stop();
                $('.dic').hide();
                $('.price-total').hide();
                $('.house-type').slideUp();
                $('.more').slideToggle("fast");
            }
            $('.sort-chose').hide();
            $('.bac').css({'z-index': '10', 'top': '4.5rem'});
            self.firstGivePage(conditionObject,self);
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
           /* $(this).siblings().removeClass('active-house');*/
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
        /*排序点击弹出*/
        $('#sort').click(function () {
            $('.bac').css({'z-index': '13', 'top': '0'});
            $('.bac').show();
            $('.sort-chose').slideToggle();
        });
        $('.bac').click(function () {
            $('.dic').slideUp();
            $('.price-total').slideUp();
            $('.house-type').slideUp();
            $('.more').slideUp();
            $('.rent-list > ul > li').children('span').removeClass('direction');
            $('.rent-list > ul > li').removeClass('active-color-top');
            $('.bac').css({'z-index': '10', 'top': '4.5rem'});
            $('.bac').hide();
            $('.slide-right').animate({right:'-50%'});
            $('.slide-right').hide();
            if(self.GetRequest()['channel'] == "jrttsub"){
                $('#sort').hide();
            }else {
                $('#sort').show();
            }
            $('.sort-chose').hide();
        });

        /*返回到列表页*/
        $('.fanhui').click(function () {
            $('.input-kw-form').css({"background-color":"#fff"});
            $('.rent-search').removeClass('active-search');
            $('.all-control').removeClass('on-hide');
            $('.rent-search').siblings('ul').removeClass('on-hide');
            $('.search-result').hide();
            $('.no-result').hide();
            $('.back').show();
            $('.icon-hanbao').show();
            $(this).hide();
            $('.contwo').hide();
            $('.show-result').hide();
            $('#searchInput').val('');
            $('.conone').hide();
        });
        /*返回到首页*/
        $('.back').click(function () {
            window.location.href = "/"
        });
        /*清楚历史*/
        $('#clearHistory').click(function () {
            localStorage.removeItem('searchHistory');
            $('.have-result').hide();
        });
        /*更多的清楚搜索*/
        $('#cancelMore').click(function () {
            /*let conditionPr = $('.house-list>ul>li');*/
            $('.more-spec > ul >li').removeClass('active-house');
            $('.area > ul >li').removeClass('active-house');
            $('.decoration > ul >li').removeClass('active-house');
        })
    }

    /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    首次渲染 所选择的条件
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
    firstGivePage(conditionObject,self) {
     /*   console.log(4323421432423);*/
        // 租房房型初次选中渲染
        if (conditionObject['la']) {
            let conditionPr = $('.house-list>ul>li');
            let laString = '';
            let numberD = [0,1,2,3,4,5];
            if (conditionObject['la'].length > 1) {
               /* console.log(conditionObject['la']);*/
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
                $('#type >p').html('多选');
                $('#type').find('i').addClass('bacchosed');
                $('#type').addClass('chosed');
            } else {
                console.log(conditionObject['la']);
                if (conditionObject['la'] == 0){
                    $('#type >p').html('户型');
                    $('#type').find('i').removeClass('bacchosed');
                    $('#type').removeClass('chosed');
                }else {
                    $('#type >p').html($(`.house-list>ul>li:eq(${conditionObject['la']})`).html());
                    $('#type').find('i').addClass('bacchosed');
                    $('#type').addClass('chosed');
                }
                $(`.house-list>ul>li:eq(${conditionObject['la']})`).addClass('active-house');
                $(`.house-list>ul>li:eq(${conditionObject['la']})`).siblings().removeClass('active-house');
            }
        }else {
            $(`.house-list>ul>li:eq(0)`).addClass('active-house');
            $(`.house-list>ul>li:eq(0)`).siblings().removeClass('active-house')
        }

        //租房价格初次选中渲染
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
        let taString = "ta-0-ta-0-ta-0-ta-0" ;
        if (conditionObject['ta']){
           taString = self.objectToString({'ta':conditionObject['ta']}); // 对象转换成字符串
        }
        if (taString !="ta-0-ta-0-ta-0-ta-0" || conditionObject['ar'] || conditionObject['dt']){
            $('#more').find('i').addClass('bacchosed');
            $('#more').addClass('chosed');
        }else {
            $('#more').find('i').removeClass('bacchosed');
            $('#more').removeClass('chosed');
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
         /*   conditionKeyArray = Object.keys(obj);
            conditionValueArray = Object.values(obj);  */
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

    creatRent(item){
        let houseTag=[];
        if (item.houseTag.isSubwayHouse) {
            houseTag.push("近地铁")
        }  if (item.houseTag.isPriceDown) {
            houseTag.push("降价")
        }  if (item.houseTag.isNewHouse) {
            houseTag.push("新上")
        }  if(item.houseTag.isHardcover == 1){
            houseTag.push("精装")
        } if(item.houseTag.isHardcover == 2){
            houseTag.push("豪装")
        } if(item.houseTag.isSouth){
            houseTag.push("朝南")
        }
        let houseTagList = '';
        if (houseTag){
            houseTag.forEach(function (item,index) {
                if (index == 0){
                    houseTagList =  `<span class="tag">${item}</span>`
                }else {
                    houseTagList += `<span class="tag">${item}</span>`
                }
            })
        }
        let domeRent=  `<a  class="rent-item box" href=" ${item.url}">
            <div class="left">
                <img src="${item.firstImageUrl}?x-oss-process=image/resize,w_120" alt="${ item.estateName} " class="lazy">
            </div>
            <div class="right">
                <h4> ${item.houseTitle}</h4>
                <p class="base-info">                    
                   ${item.houseTypeStr} ${item.spaceArea}㎡ | ${item.districtAndTownName}
                </p>
                <p class="tags">${houseTagList}</p>
                <p class="unit-price"> ${item.rentPriceStr} 元/月</p>
            </div>
        </a>`;
        return domeRent
    }

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     上拉加载实例化
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    pullload(conditionObject) {
        console.log("conditionObject"+JSON.stringify(conditionObject));
        let self = this ;
        //租房列表
        $(".rent-items").pullload({
            apiUrl : this.apiUrl.rent.list.rentHouseList ,
            requestType: "post",
            queryStringObject : conditionObject ,
            traditional: true,
            pageSize:10,
           /* apiDataType:"application/json",*/
            threshold : 50 ,
            callback : function(data) {
                if( ! data.data) return ;
                $.each(data.data , (index , rent)=> {
                    rent.url = "/shanghai/rent/" + rent.encryptHouseId + ".html" ;
                    $(".rent-items").append(self.creatRent(rent)) ;
                }) ;
            }
        }) ;

    } ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     判断search板块？后面的参数是什么
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    checkType(type,value){
       let typeSearch = '';
       if (type == 1){
           typeSearch = "?districtId=" + value;
       }else if (type == 2){
           typeSearch = "?townId="+value;
       }else if (type == 3){
           typeSearch = "?subwayLine="+value;
       }else if (type == 4){
           typeSearch = "?subwayStation="+value;
       }else if (type == 5){
           typeSearch = "?subEstateId="+value;
       }
       if (this.GetRequest()['channel'] == "jrttsub" && typeSearch){
           typeSearch = typeSearch+"&channel=jrttsub"
       }else if (this.GetRequest()['channel'] == "jrttsub" && !typeSearch){
           typeSearch = "?channel=jrttsub"
       }else if (!this.GetRequest()['channel'] == "jrttsub" && typeSearch){
           typeSearch = typeSearch
       }
       return typeSearch

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
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     查询？后面 是否包含搜索的参数
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
     haveNot(){
         if (this.GetRequest()['districtId'] || this.GetRequest()['townId'] || this.GetRequest()['subwayLine'] || this.GetRequest()['subwayStation'] || this.GetRequest()['subEstateId']){
             return true
         }else {
             return false
         }
     }

}


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new ListController;
});