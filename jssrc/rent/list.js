/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：rent/list(租房-列表)
 3. 作者：liyang@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


class ListController extends Controller {
    constructor() {
        super();
        this.readyFun();
        let that = this;
        let url =  location.href.slice(0,location.href.lastIndexOf('/')+1);
        let condition = location.href.slice(location.href.lastIndexOf('/')+1,location.href.length);
        let conditionObject = this.parseCondition({condition:condition});  // 转成对象
        this.choseFun(conditionObject);
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        请求接口 获取城市区域
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.request(this.apiUrl.rent.list.cityAreas,{houseType:3,cityId:3},{successCallback(data){
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
                            let conditionString = that.objectToString(conditionObject);
                            console.log(conditionString);
                            window.location= url + conditionString;
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
                                    window.location= url + conditionString;  // 跳转的URL
                                } else {
                                    $('#dic > p').html(dataTownName);
                                    let areasTownString = dataAreasDi + '-' + dataTownTo;  // 字符串链接
                                    let areasTownObj = that.parseCondition({condition: areasTownString}); // 转换成对象
                                    Object.assign(conditionObject, areasTownObj);   // 合并对象
                                    let conditionString = that.objectToString(conditionObject); // 转换成字符串
                                    console.log(conditionString);
                                    window.location = url + conditionString;  // 跳转的URL
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
                        delete(conditionObject['st']);  // 删除地铁站点的对象
                        if (dataTownName == "不限") {
                            $('#dic > p').html(dataAreasName);
                            let dataAreasDiObj =  that.parseCondition({condition:dataAreasDi});  // 转换成对象
                            Object.assign(conditionObject,dataAreasDiObj); // 合并对象
                            delete(conditionObject['to']);  // 删除town的对象
                            let conditionString = that.objectToString(conditionObject); // 转换成字符串
                            console.log(conditionString);
                            window.location= url + conditionString;  // 跳转的URL
                        } else {
                            $('#dic > p').html(dataTownName);
                            let areasTownString = dataAreasDi + '-' + dataTownTo;  // 字符串链接
                            let areasTownObj = that.parseCondition({condition: areasTownString}); // 转换成对象
                            Object.assign(conditionObject, areasTownObj);   // 合并对象
                            let conditionString = that.objectToString(conditionObject); // 转换成字符串
                            console.log(conditionString);
                            window.location = url + conditionString;  // 跳转的URL
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
        this.request(this.apiUrl.rent.list.citySubway,{cityId:3},{successCallback(data){
                if (data.status == 1) {
                    let dataRes = data;
                    let subwayLine = dataRes.data;
                    console.log(subwayLine);
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
                                window.location = url + conditionString;  // 跳转的URL
                            } else {
                                $('#dic > p').html(dataStationName); // 判断赋值给检索title
                                let lineStationString = dataLineLi + '-' + dataStationSt; // 合并字符串
                                let lineStationObj = that.parseCondition({condition: lineStationString}); // 转换成对象
                                Object.assign(conditionObject, lineStationObj); // 合并对象
                                let conditionString = that.objectToString(conditionObject); // 转换成字符串
                                console.log(conditionString);
                                window.location = url + conditionString; // 跳转的URL
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
                            window.location = url + conditionString;  // 跳转的URL
                        } else {
                            $('#dic > p').html(dataStationName); // 判断赋值给检索title
                            let lineStationString = dataLineLi + '-' + dataStationSt; // 合并字符串
                            let lineStationObj = that.parseCondition({condition: lineStationString}); // 转换成对象
                            Object.assign(conditionObject, lineStationObj); // 合并对象
                            let conditionString = that.objectToString(conditionObject); // 转换成字符串
                            console.log(conditionString);
                            window.location = url + conditionString; // 跳转的URL
                        }
                        $('.bac').hide();
                        $('#dic').children('span').removeClass('direction');
                        $('#dic').find('i').addClass('bacchosed');
                        $('#dic').addClass('chosed');
                        $('.dic').slideToggle();
                    })
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
                window.location = url + conditionString; // 跳转的URL
            }else {
                $('#price>p').html($(this).html().replace(/\s|\xA0/g,""));
                $('#price').find('i').addClass('bacchosed');
                $('#price').addClass('active-color-top');
                let dataPrice = $(this).attr("data-pr");
                let dataPriceObj = that.parseCondition({condition: dataPrice}); // 转换成对象
                Object.assign(conditionObject, dataPriceObj); // 合并对象
                let conditionString = that.objectToString(conditionObject); // 转换成字符串
                console.log(conditionString);
                window.location = url + conditionString; // 跳转的URL
            }
            $('.price-total').slideToggle();
        });
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        租房价格自定义函数
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $('#selfPrConf').click(function () {
            let lowPr = $('#lowPr').val();
            let topPr=  $('#topPr').val();
            if(lowPr && topPr){
                $('#price>p').html(lowPr+'-'+topPr);
                $('#price').find('i').addClass('bacchosed');
                $('#price').addClass('active-color-top');
                delete(conditionObject['pr']);  // 删除价格选择的参数的对象
                let cp = {"cp":lowPr+"to"+topPr};
                Object.assign(conditionObject, cp); // 合并对象
                let conditionString = that.objectToString(conditionObject); // 转换成字符串
                console.log(conditionString);
                window.location = url + conditionString; // 跳转的URL
            } else if (lowPr == '' && topPr){
                $('#price>p').html(topPr+'以下');
                $('#price').find('i').addClass('bacchosed');
                $('#price').addClass('active-color-top');
                delete(conditionObject['pr']);  // 删除价格选择的参数的对象
                let cp = {"cp":"0"+"to"+topPr};
                Object.assign(conditionObject, cp); // 合并对象
                let conditionString = that.objectToString(conditionObject); // 转换成字符串
                console.log(conditionString);
                window.location = url + conditionString; // 跳转的URL
            } else if(topPr == '' && lowPr){
                $('#price>p').html(lowPr+'以上');
                $('#price').find('i').addClass('bacchosed');
                $('#price').addClass('active-color-top');
                delete(conditionObject['pr']);  // 删除价格选择的参数的对象
                let cp = {"cp":lowPr+"to"+"0"};
                Object.assign(conditionObject, cp); // 合并对象
                let conditionString = that.objectToString(conditionObject); // 转换成字符串
                console.log(conditionString);
                window.location = url + conditionString; // 跳转的URL
            }else {
                $('#price>p').html("租金");
                $('#price').find('i').removeClass('bacchosed');
                $('#price').removeClass('active-color-top');
                $('#price').removeClass('chosed');
                delete(conditionObject['pr']);  // 删除价格选择的参数的对象
                delete(conditionObject['cp']);  // 删除价格自定义参数的对象
                let conditionString = that.objectToString(conditionObject); // 转换成字符串
                console.log(conditionString);
                window.location = url + conditionString; // 跳转的URL
            }
            $('.bac').hide();
            $('#price').children('span').removeClass('direction');
            $('.price-total').slideToggle();

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
                 window.location = url + conditionString; // 跳转的URL
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
            tag.each(function (index,item) {
                if(item.classList.length == 1){ // 根据标签样式判断是否有选择
                    if(index == 0) {
                        tagString = "ta-1"
                    }else {
                        tagString  = tagString +'-'+"ta-1"
                    }
                }else {
                    if(index == 0) {
                        tagString = "ta-0"
                    }else {
                        tagString = tagString +'-'+"ta-0"
                    }
                }
            });
            area.each(function (index,item) {
                if(item.classList.length == 1){
                    areaString = $(`.area > ul >li:eq(${index})`).attr('data-ar');
                }
            });
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
            Object.assign(moreDta, tagObj, areaObj, decorationObj); // 合并对象
            if (areaObj['ar'] || decorationObj['dt'] || tagString != "ta-0-ta-0-ta-0-ta-0"){
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
            window.location = url + conditionString; // 跳转的URL
        });
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        排序
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        if (conditionObject['so']){
            let sortChose = $('.sort-chose>ul>li');
            let soSting =  that.objectToString({'so':conditionObject['so']}); // 转换成字符串
            sortChose.each(function (index,item) {
                if (soSting == $(`.sort-chose>ul>li:eq(${index})`).attr('data-so')){
                    $(`.sort-chose>ul>li:eq(${index})`).removeClass('chosed');
                    $(`.sort-chose>ul>li:eq(${index})`).addClass('chosed')
                }
            })
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
            window.location = url + conditionString; // 跳转的URL
        });
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        搜索
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

        $('#searchInput').keyup(function () {
            if ($(this).val()) {
                $('.icon-close').show();
                $('.have-result').hide();
                $('.icon-close').click(function () {
                    $('#searchInput').val('');
                    $('.icon-close').hide();
                });
                let sendData={
                    key:$(this).val(),
                    cityId:43,
                    pageName:"renthouselist"
                };
                console.log(sendData);
               that.request(that.apiUrl.rent.list.acWord,sendData,{successCallback(data){
                   let renthouselistData = data.data;
                   if (renthouselistData){
                      $('#showResult')
                   }
                   console.log(JSON.stringify(data))
                   }})
            }
        })

    }

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    条件选择的初始化函数
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    readyFun() {
        /* $('.dic').hide();*/
        /*$('.bac').hide();*/
        /*$('.price-total').hide();*/
        /* $('.house-type').hide();*/
        /*$('.more').hide();*/
        /*$('.sort-chose').hide();*/
        setTimeout(function () {
            $('.total-num').hide();
            $('.all-control').css("margin-top","10rem");
        },1500);

       /* $('.house-list > ul > li:eq(0)').addClass('active-house');*/
        $('.content-hight').height($(window).height()*0.7 - $('.tabs').height());
    }

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    条件选择的区域选择的点击效果函数
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    choseFun(conditionObject) {
        let self = this;
            /* 条件选择点击事件*/
        $('.rent-list > ul > li').click(function () {
            self.firstGivePage(conditionObject,self);
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
            list.each(function (index, item) {   //根据span标签的样式指向判断底部罩层是否显示
                if (item.classList.length == 1) {
                    $('.bac').show();
                }
            });
            let indexP = $(this).index();
            /*根据点击li标签的位置判断相应的模块响应出现*/
            if (indexP == 0) {     /*判断区域模块的显示*/
                $('.dic').stop();
                $('.price-total').hide();
                $('.house-type').hide();
                $('.more').hide();
                $('.dic').slideToggle();
            } else if (indexP == 1) {      /*判断价格模块的显示*/
                $('.bac').stop();
                $('.dic').hide();
                $('.house-type').hide();
                $('.more').hide();
                $('.price-total').slideToggle();
            } else if (indexP == 2) {    /* 判断户型模块显示*/
                $('.bac').stop();
                $('.dic').hide();
                $('.price-total').hide();
                $('.more').hide();
                $('.house-type').slideToggle();
            } else if (indexP == 3) {    /* 判断更多模块显示*/
                $('.bac').stop();
                $('.dic').hide();
                $('.price-total').hide();
                $('.house-type').slideUp();
                $('.more').slideToggle();
            }
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
            $(this).siblings().removeClass('active-house');
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
        /*排序点击选择*/

        /*搜索框的点击*/
        $('#searchInput').click(function () {
            $('.rent-search').addClass('active-search');
            $('.rent-search').siblings('ul').addClass('on-hide');
            $('.all-control').addClass('on-hide');
            $('body').css('background-color','#F0F0F0')
        });
        /*更多的清楚搜索*/
        $('#cancelMore').click(function () {
            /*let conditionPr = $('.house-list>ul>li');*/
            $('.more-spec > ul >li').removeClass('active-house');
            $('.area > ul >li').removeClass('active-house');
            $('.decoration > ul >li').removeClass('active-house');
        })
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    获取城市区域之后渲染到页面
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    giveAreasData(dataAreas){
        console.log(dataAreas.data);
        let dataDic = dataAreas.data;
        let dicAreas = "<li >不限</li>";
        dataDic.forEach(function (item) {   // 循环渲染地铁线路
            dicAreas += `<li data-id ="${item.id}" data-di="di-${item.id}">${item.name}</li>`
        });
        $('#dicAreas').append(dicAreas);
        $('#dicAreas>li').click(function () {           // 点击areas更换相应的town
            let dataAreasId = $(this).attr("data-id");  // areas的id 后面循环对比需要
            let dataAreasDi = $(this).attr("data-di");  // 需要传给后台pinURL的参数  areas
            let dataAreasName = $(this).html();        // 获取中文地铁线路名称
            $(this).siblings().removeClass('areas-subway');
            $(this).addClass('areas-subway');
            if(dataAreasName == "不限") {
                $('#dic>p').html("区域") ;
                $('.bac').hide();
                $('#dic').children('span').removeClass('direction');
                $('#dic').find('i').removeClass('bacchosed');
                $('#dic').removeClass('active-color-top');
                $('#dic').removeClass('chosed');
                $('.dic').slideToggle();
            }else {
                dataDic.forEach(function (item) {    //
                    if(dataAreasId == item.id && item.townList){
                        let townList ="<li>不限</li>" ;
                        item.townList.forEach(function (item) {  // 循环渲染town
                            townList += `<li data-id ="${item.id}" data-to="to-${item.id}">${item.name}</li>`
                        });
                        $('#town').empty();
                        $('#town').append(townList);
                    }
                });
                $('#town >li').click(function () {  // town的点击获取
                    $(this).siblings().removeClass('chosed');
                    $(this).addClass('chosed');
                    let dataTownId = $(this).attr("data-id");      // 站点的id
                    let dataTownTo =  $(this).attr("data-to");   // 需要传给后台pinURL的参数  town
                    let dataTownName = $(this).html();   // 获取中文town名称
                    if (dataTownName == "不限") {
                        $('#dic > p').html(dataAreasName);
                    } else {
                        $('#dic > p').html(dataTownName);
                    }
                    $('.bac').hide();
                    $('#dic').children('span').removeClass('direction');
                    $('#dic').find('i').addClass('bacchosed');
                    $('#dic').addClass('chosed');
                    $('.dic').slideToggle();
                })

            }
        })
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    获取地铁之后渲染到页面
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    giveSubwayData(dataSubway,url) {
        console.log(dataSubway.data);
        let subwayLine = dataSubway.data;
        let metroLine = '';
        subwayLine.forEach(function (item) {   // 循环渲染地铁线路
            metroLine += `<li data-id ="${item.id}" data-li="li-${item.id}">${item.name}</li>`
        });
        $('#metroLine').append(metroLine);
        $('#metroLine > li').click(function () {   // 点击地铁线路更换相应的站点
            let dataLineId = $(this).attr("data-id");  // 地铁线路的id 后面循环对比需要
            let dataLineLi = $(this).attr("data-li"); // 需要传给后台pinURL的参数  地铁线路
            let dataLineName = $(this).html();    // 获取中文地铁线路名称
            $(this).siblings().removeClass('areas-subway');
            $(this).addClass('areas-subway');
            subwayLine.forEach(function (item) {
                if ( dataLineId == item.id && item.subList){
                    let metroStation ="<li>不限</li>" ;
                   item.subList.forEach(function (item) { // 循环渲染地铁站点
                       metroStation += `<li data-id ="${item.id}" data-st="st-${item.id}">${item.name}</li>`
                   });
                    $('#metroStation').empty();
                    $('#metroStation').append(metroStation);
                }
            });
            $('#metroStation > li').click(function () {   // 站点的点击
                $(this).siblings().removeClass('chosed');
                $(this).addClass('chosed');
                let dataStationId = $(this).attr("data-id");      // 站点的id
                let dataStationSt =  $(this).attr("data-st");   // 需要传给后台pinURL的参数  站点
                let dataStationName = $(this).html();  // 获取中文地铁站点名称
                if ($(this).html() == "不限") {     // 判断赋值给检索title
                    $('#dic > p').html(dataLineName);
                    window.location= url+dataLineLi;
                } else {
                    $('#dic > p').html(dataStationName);
                    window.location= url+dataLineLi+"-"+dataStationSt;
                }
                $('.bac').hide();
                $('#dic').children('span').removeClass('direction');
                $('#dic').find('i').addClass('bacchosed');
                $('#dic').addClass('chosed');
                $('.dic').slideToggle();
            })
        });
    }

    /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    首次渲染 所选择的条件
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
    firstGivePage(conditionObject,self) {
        // 租房房型初次选中渲染
        if (conditionObject['la']) {
            let conditionPr = $('.house-list>ul>li');
            let laString = '';
            if (conditionObject['la'].length > 1) {
                conditionObject['la'].forEach(function (item, index) {
                    if (index == 0) {
                        laString = "la-" + item
                    } else {
                        laString = laString + ',' + "la-" + item
                    }
                });
                $('#type >p').html('多选');
                $('#type').find('i').addClass('bacchosed');
                $('#type').addClass('chosed');
            } else {
                laString = self.objectToString({"la": conditionObject['la']}); // 对象转换成字符串
            }
            let conditionArray = laString.split(',');
            conditionPr.each(function (index, item) {  // 循环对比属性
                conditionArray.forEach(function (item) {
                    if (item == $(`.house-list>ul>li:eq(${index})`).attr('data-la')) {
                        $(`.house-list>ul>li:eq(${index})`).addClass('active-house');
                        if (index > 0 && conditionArray.length == 1) {
                            $('#type >p').html($(`.house-list>ul>li:eq(${index})`).html());
                            $('#type').find('i').addClass('bacchosed');
                            $('#type').addClass('chosed');
                        }
                    }else {
                        $(`.house-list>ul>li:eq(${index})`).removeClass('active-house');
                    }
                });

            })
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
        let taString = self.objectToString({'ta':conditionObject['ta']}); // 对象转换成字符串
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
        }
        //面积 初次选中渲染
        if (conditionObject['ar']) {
            let conditionAr = $('.area >ul>li');
            let conditionString = self.objectToString({"ar": conditionObject['ar']}); // 对象转换成字符串
            conditionAr.each(function (index,item) {
                if (conditionString == $(`.area>ul>li:eq(${index})`).attr('data-ar')){
                    $(`.area>ul>li:eq(${index})`).addClass('active-house')
                }else {
                    $(`.area>ul>li:eq(${index})`).removeClass('active-house')
                }
            })
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
        let conditionKeyArray = Object.keys(obj);
        let conditionValueArray = Object.values(obj);
        let conditionString = '';
        conditionKeyArray.forEach((item, index) => {
            let itemUp = item;
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
                    conditionString = item + '-' + conditionValueArray[index]
                }

            } else {
                if (conditionValueArray[index].constructor == Array){
                    conditionValueArray[index].forEach(function (item,index) {
                            conditionString = conditionString + '-'+ itemUp + '-'+ item
                    })
                }else {
                    conditionString = conditionString + '-' + item + '-' + conditionValueArray[index]
                }

            }

        });
        return conditionString
    }
}


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new ListController;
});