/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：components -> filter(筛选条件)
 3. 作者：tangxuyang@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
 /**
  * options: {
      el: "", //挂载点
      houseType: "",//查询区域板块用的
      cityId: "",//查询区域板块和地铁用的
      cityName: "",
      near: true,
      longitude: "",// 经度
      latitude: "",// 纬度
      distances: [{value: "5000", text: "不限（智能范围）"},{value: "500", text: "500米"},{value: "1000", text: "1000米"},{value: "2000", text: "2000米"},{value: "5000", text: "5000米"}],
      filterChanged: function(condition){
        condition:{
            price: "",
            sort: "",
            district: "",
            town: "",
            metro: "",
            station: "",
            districtPinyin: "",
            metroKey: ""
            ...
        }

      },//查询条件变化回调
      prices:[{
          id: "",
          text: "不限"          
      },{
          id: "1",
          text: "100万以下"
      }],
      houseTypes:[{
          name: "types",//用来作为返回查询条件的key
          title: "户型",
          items: [{
              id: "",
              text: "不限",
              exclusive: true,//互斥
          }]
      },{
          name: "features",
          title: "特色",
          items: [{
              id: "",
              text: "进地铁"
          }]
      },{
          name: "propertyTypes",
          title: "物业类型",
          items: [{
              id: "",
              text: "住宅"
          }]
      },{
          name: "decorations",
          title: "装修",
          items: [{
              id: "",
              text: "毛坯"
          }]
      }],
      sorts:[{
          id: "",
          text: "综合排序"
      }]
  }

  filteChange的参数: {
    sort: "", //排序
    price: "",//价格
    district: "",//区域id
    town: "",//板块id
    metro: "",//地铁线id
    station: "",//地铁站id
    .... // 对应options中houseTypes的name
  }
  */

/*
* ---------------------------取自underscore----------------------------
*/
var templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
};

var noMatch = /(.)^/;

var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

var escapeChar = function(match) {
    return '\\' + escapes[match];
};

var _template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = $.extend({}, settings, templateSettings);

    var matcher = RegExp([
        (settings.escape || noMatch).source,
        (settings.interpolate || noMatch).source,
        (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
        source += text.slice(index, offset).replace(escaper, escapeChar);
        index = offset + match.length;

        if (escape) {
            source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
        } else if (interpolate) {
            source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        } else if (evaluate) {
            source += "';\n" + evaluate + "\n__p+='";
        }
        
        return match;
    });
    source += "';\n";

    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
        "print=function(){__p+=__j.call(arguments,'');};\n" +
        source + 'return __p;\n';

    try {
        var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
        e.source = source;
        throw e;
    }

    var template = function(data) {
        return render.call(this, data);
    };

    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
};

/*
* ----------------------------------------------------------------------
*/
define([],function(){
    const DEFAULT =  {
        el: "", //挂载点
        filterChanged: function(condition){},//查询条件变化回调
        prices:[{
            id: "",
            text: "不限"          
        },{
            id: "1",
            text: "100万以下"
        },{
            id: "2",
            text: "100-150万"
        },{
            id: "3",
            text: "150-200万"
        },{
            id: "4",
            text: "200-250万"
        },{
            id: "5",
            text: "250-300万"
        },{
            id: "6",
            text: "300-500万"
        },{
            id: "7",
            text: "500-1000万"
        },{
            id: "8",
            text: "1000-2000万"
        },{
            id: "9",
            text: "2000万以上"
        }],
        houseTypes:[{
            name: "types",//用来作为返回查询条件的key
            title: "户型",
            items: [{
                id: "",
                text: "不限",
                exclusive: true,//互斥
            },{
                id: "1",
                text: "一室",
                exclusive: false,//互斥
            },{
                id: "2",
                text: "二室",
                exclusive: false,//互斥
            },{
                id: "3",
                text: "三室",
                exclusive: false,//互斥
            },{
                id: "4",
                text: "四室",
                exclusive: false,//互斥
            },{
                id: "5",
                text: "五室及以上",
                exclusive: false,//互斥
            }]
        },{
            name: "features",
            title: "特色",
            items: [{
                id: "f1",
                text: "近地铁"
            },{
                id: "s1",
                text: "即将开盘"
            },{
                id: "s2",
                text: "在售楼盘"
            },{
                id: "f0",
                text: "有优惠"
            },{
                id: "f2",
                text: "有视频"
            }]
        },{
            name: "propertyTypes",
            title: "物业类型",
            items: [{
                id: "t1",
                text: "住宅"
            },{
                id: "t2",
                text: "别墅"
            },{
                id: "t3",
                text: "商用"
            }]
        },{
            name: "decorations",
            title: "装修",
            items: [{
                id: "1",
                text: "毛坯"
            },{
                id: "2",
                text: "精装"
            },{
                id: "3",
                text: "豪装"
            }]
        }],
        sorts:[{
            id: "-1",
            text: "综合排序"
        },{
            id: "1",
            text: "均价从低到高"
        },{
            id: "2",
            text: "均价从高到低"
        },{
            id: "3",
            text: "面积从小到大"
        },{
            id: "4",
            text: "面积从大到小"
        }],
        near: true
    };
    
    function createPriceSection(prices){// 价格
        var templateStr = '<div class="total-price">\
                                <ul>\
                                <%for(var i = 0; i < prices.length; i++){%>\
                                    <li data-value="<%=prices[i].id%>"><%=prices[i].text%></li>\
                                <%}%>\
                                </ul>\
                                <div>\
                                    <div>\
                                        <input type="number" placeholder="最低价格">\
                                    </div>\
                                    <div class="normal">-</div>\
                                    <div>\
                                        <input placeholder="最高价格" type="number">\
                                    </div>\
                                    <div class="normal"></div>\
                                    <div>\
                                        <button type="button">确定</button>\
                                    </div>\
                                </div>\
                            </div>';
        var html = _template(templateStr)({prices:prices});        
        return html;
    }

    function createHouseTypeSection(houseTypes){// 户型        
        var templateStr = '<div class="house-type">\
                            <div class="house-type-inner">\
                                <% var c = count || 4;%>\
                                <%for(var i = 0; i < houseTypes.length; i++){%>\
                                    <div class="house-type-section" data-key="<%= houseTypes[i].name%>">\
                                        <h4><%= houseTypes[i].title%></h4>\
                                        <%var r = Math.ceil(houseTypes[i].items.length/c);%>\
                                        <%for(var j = 0; j < r; j++){%>\
                                            <ul>\
                                            <%for(var k = 0; k < c; k++){%>\
                                              <%var item = houseTypes[i].items[j*c +k];%>\
                                              <%if(item){%>\
                                              <li data-value="<%= item.id%>" data-exclusive="<%= item.exclusive?1:0%>"><%= item.text %></li>\
                                              <%}else{%>\
                                                <li class="placeholder"></li>\
                                              <%}%>\
                                            <%}%>\
                                            </ul>\
                                        <%}%>\
                                    </div>\
                                    <%}%></div>\
                                    <ul class="operation">\
                                        <li class="reset">重置</li>\
                                        <li class="confirm">确定</li>\
                                    </ul>\
                            </div>';
        
        var html = _template(templateStr)({houseTypes: houseTypes, count: 4});
        return html;
    }

    function createSortSection(sorts){// 排序
        var templateStr = '<div class="sort">\
                                <ul>\
                                <%for(var i = 0; i < sorts.length; i++){%>\
                                    <li data-value="<%= sorts[i].id%>"><%= sorts[i].text%></li>\
                                <%}%>\
                                </ul>\
                            </div>';
        var html = _template(templateStr)({sorts: sorts});
        return html;        
    }

    function createDistrictAndMetroSection(options){// 区域（包括区域和地铁）
        var templateStr = '<div class="district-metro"><ul><li class="active">区域</li><li>地铁</li></ul><div class="district district-metro-item">\
                                <div class="district-inner">\
                                    <ul class="parent">\
                                        <%if(near){%>\
                                        <li data-value="near" class="near"><%= latitude && longitude ? "附近" : "定位失败"%></li>\
                                        <%}%>\
                                        <li>不限</li>\
                                        <%for(var i = 0; i< districts.length; i++){%>\
                                        <li data-value="<%= districts[i].id%>"><%= districts[i].name%></li>\
                                        <%}%>\
                                    </ul>\
                                    <div class="child">\
                                    <%if(longitude && latitude){%>\
                                        <ul data-value="near" class="near">\
                                            <%for(var i = 0; distances && i < distances.length; i++){%>\
                                                <li class="near" data-value="<%=distances[i].value%>"><%= distances[i].text%></li>\
                                            <%}%>\
                                        </ul>    \
                                    <%}%>\
                                    <%for(var i = 0; i < districts.length; i++){%>\
                                        <ul data-value="<%= districts[i].id%>" data-text="<%= districts[i].name%>">\
                                            <li data-pinyin="<%=districts[i].pinyin%>">不限</li>\
                                            <%for(var j = 0; j < districts[i].townList.length; j++){%>\
                                                <li data-pinyin="<%=districts[i].pinyin%>-<%=districts[i].townList[j].pinyin%>" data-value="<%= districts[i].townList[j].id%>"><%= districts[i].townList[j].name%></li>\
                                            <%}%>\
                                        </ul>\
                                    <%}%>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="metro district-metro-item">\
                            <div class="metro-inner">\
                                <ul class="parent">\
                                    <li>不限</li>\
                                    <%for(var i = 0; i< metros.length; i++){%>\
                                    <li data-value="<%= metros[i].id%>"><%= metros[i].name%></li>\
                                    <%}%>\
                                </ul>\
                                <div class="child">\
                                <%for(var i = 0; i < metros.length; i++){%>\
                                    <ul data-value="<%= metros[i].id%>" data-text="<%= metros[i].name%>">\
                                        <li data-pinyin="<%=metros[i].key%>">不限</li>\
                                        <%for(var j = 0; j < metros[i].subList.length; j++){%>\
                                            <li data-pinyin="<%=metros[i].key%><%=metros[i].subList[j].key%>" data-value="<%= metros[i].subList[j].id%>"><%= metros[i].subList[j].name%></li>\
                                        <%}%>\
                                    </ul>\
                                <%}%>\
                            </div>\
                        </div>\
                        </div></div>';
        console.log("经纬度：", options.latitude, options.longitude);
        var html = _template(templateStr)({districts: options.districts, metros: options.metros, longitude: options.longitude, latitude: options.latitude, distances: options.distances, near: options.near});        
        return html;
    }

    function create(){
        var options = this.options;
        return '<ul class="filter-items"><li><span class="label">区域</span><span class="triangle"></span></li><li><span class="label">总价</span><span class="triangle"></span></li><li><span class="label">户型</span><span class="triangle"></span></li><li><span class="label">排序</span><span class="triangle"></span></li></ul><div class="content"><div class="content-inner">'+createDistrictAndMetroSection(options)+createPriceSection(options.prices)+createHouseTypeSection(options.houseTypes)+createSortSection(options.sorts)+'</div></div>';
    }

    // 计算查询提交，并调用filterChange回调
    function calcCondition() {
        var result = {};
        // 排序
        $('.sort .active').each(function(){
            result.sort = $(this).data('value');
        });

        // 总价
        $('.total-price .active').each(function(){
            result.price = $(this).data('value');
        });
        // TODO:读取自定义总价

        // 户型
        $('.house-type-section').each(function(){
            var key = $(this).data('key');
            result[key] = [];
            $(this).find('.active').each(function(){
                var value = $(this).data('value');
                if(value != null && value != undefined && value != ''){
                    result[key].push(value);
                }                    
            });
            if(result[key].length == 0){// 没选中则删除
                delete result[key];
            }
        });

        // 区域地铁
        /*
        $('.district .parent li.active').each(function(){
            result.district = $(this).data('value');
        });
        $('.district .child li.active').each(function(){
            result.town = $(this).data('value');
        });
        $('.metro .parent li.active').each(function(){
            result.metro = $(this).data('value');
        });
        $('.metro .child li.active').each(function(){
            result.station = $(this).data('value');
        });*/
        // 区域地铁的有点复杂，还是在点击选中时直接复制给this.result
        
        result = $.extend({}, this.result, result);
        this.options.filterChanged && this.options.filterChanged(result);        
    }

    function bindEvent() {
        var self = this;
        
        // 关闭筛选弹层
        function hide(){            
            self.$content.hide();
            $('.filter .filter-items li').removeClass('open');
            self.$body.removeClass('noscroll');
        }

        // 打开筛选弹层
        function show(index){
            // 先隐藏
            self.$districtMetro.hide();
            self.$price.hide();
            self.$houseType.hide();
            self.$sort.hide();

            $('.filter-items li').removeClass('open');            
            self.$content.show();
            switch(index){
                case 0:
                    self.$districtMetro.slideDown();
                    self.$districtLabel.parent().addClass('open');
                break;
                case 1:
                    self.$price.slideDown();
                    self.$priceLabel.parent().addClass('open');
                break;
                case 2:
                    self.$houseType.slideDown();
                    self.$houseTypeLabel.parent().addClass('open');
                break;
                case 3:
                    self.$sort.slideDown();
                    self.$sortLabel.parent().addClass('open');
                break;
            }
            self.$body.addClass('noscroll');
        }

        // 点击区域、总价、户型、排序，展示详情筛选条件
        $('.filter-items li').click(function(){
            if($(this).hasClass('open')){//当前筛选条件已经显示了，则关闭                
                hide();
            }else{
                var index = $('.filter-items li').index(this);                                        
                show(index);                
            }
        });

        // 点击排序中的选项
        $('.filter .sort li').click(function(){            
            self.$sort.find('li').removeClass('active');
            $(this).addClass('active');
            hide();
            calcCondition.apply(self);
            var id = $(this).data('value');
            if(id){
                self.$sortLabel.text($(this).text()).parent().addClass('active');
            } else {
                self.$sortLabel.text("排序").parent().removeClass('active');
            }
        });

        // 点击总价中的选项
        $('.filter .total-price li').click(function(){            
            self.$price.find('li').removeClass('active');
            $(this).addClass('active');
            hide();
            var id = $(this).data('value');
            if(id) {
                self.$priceLabel.text($(this).text()).parent().addClass('active');;
            } else {
                self.$priceLabel.text("总价").parent().removeClass('active');
            }
            self.$minPrice.val('');
            self.$maxPrice.val('');
            calcCondition.apply(self);
        });

        // 自定义价格区间确定按钮
        $('.filter .total-price button').click(function(){
            // 校验输入，并做相应处理
            var minText = $.trim(self.$minPrice.val());
            var maxText = $.trim(self.$maxPrice.val());
            var min = parseInt(minText) || 0;
            var max = parseInt(maxText) || 0;

            if(min != minText && minText || max != maxText && maxText || min > max) {
                // TODO:提示价格区间有误，请从新输入

                return;
            }
            self.result.price = (min || 0) + "to" + (max || 0);
            if(self.result.price=="0to0"){
                delete self.result.price;
            }
            var str = "";
            if(!min && max){
                str = max + "万以下";
            } else if (min && !max) {
                str = min + "万以上";
            } else if (min && max) {
                str = min + "-" + max + "万";
            }
            if(str) {
                self.$priceLabel.text(str).parent().addClass('active');
            }else{
                self.$priceLabel.text("总价").parent().removeClass('active');
            }
            self.$price.find('li').removeClass('active');
            hide();
            calcCondition.apply(self);
        });

        // 户型中选项
        $('.filter .house-type-section li:not(.placeholder)').click(function(){
            var $this = $(this);
            if($this.hasClass('active')){// 已经选中了，则去除选中
                $this.removeClass('active');
            }else{                
                // 互斥处理
                var $parent = $this.closest('.house-type-section');
                var $items = $parent.find('li:not(.placeholder)');
                if($this.data('exclusive')){//互斥
                    $items.removeClass('active');
                }else{// 不互斥
                    $items.filter('[data-exclusive=1]').removeClass('active');
                } 
                $this.addClass('active');               
            }                        
        });

        // 户型中重置和确定按钮
        self.$houseTypeResetBtn.click(function(){
            self.$houseType.find('.house-type-section li:not(.placeholder)').removeClass('active');
            //$('.filter .house-type-section li:not(.placeholder)').removeClass('active');
        });
        self.$houseTypeConfirmBtn.click(function(){
            if(self.$houseType.find('.active').length > 0){
                self.$houseTypeLabel.parent().addClass('active');
            }else{
                self.$houseTypeLabel.parent().removeClass('active');
            }
            hide();
            calcCondition.apply(self);
        });

        //区域中，区域地铁单击
        $('.filter .district-metro >ul li').click(function(){
            var index = $('.filter .district-metro >ul li').index(this);
            if(index == 0){// 点击的区域                                
                self.$metro.hide();
                self.$district.show();
            } else {// 地铁                
                self.$metro.show();
                self.$district.hide();
            }
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
        });

        // 区域、地铁
        $('.filter .parent li').click(function(){
            var $this = $(this);
            var id = $this.data('value');            
            $this.siblings().removeClass('active');
            $this.addClass('active');
            var $parent = $this.parent();
            $parent.siblings('.child').find('ul').hide().filter('[data-value='+id+']').show();
            if(!id){// 不限
                delete self.result.district;
                delete self.result.town;
                delete self.result.metro;
                delete self.result.station; 
                delete self.result.districtPinyin;
                delete self.result.metroKey;
                hide();
                calcCondition.apply(self);    
                self.$districtLabel.text("区域").parent().removeClass('active');           
            }
        });

        // 板块、地铁站
        $('.filter .district .child li').click(function(){
            var $this = $(this);
            $('.district-metro .child li').removeClass('active');
            $this.addClass('active');
            delete self.result.metro;
            delete self.result.station;
            delete self.result.metroKey;
            delete self.result.district;
            delete self.result.town;
            delete self.result.districtPinyin;
            delete self.result.longitude;
            delete self.result.latitude;
            delete self.result.meter;

            var str = "";
            
            if($this.hasClass('near')){//附近中选项                
                self.result.longitude = self.options.longitude;
                self.result.latitude = self.options.latitude;
                self.result.meter = $this.data('value');
                str = $this.text();
                if(str.indexOf('不限')> -1){
                    str = "附近";
                }
            }else{
                self.result.district = $this.parent().data('value');
                self.result.town = $this.data('value');
                self.result.districtPinyin = $this.data('pinyin');
                if(!self.result.town){// 不限
                    str = $this.parent().data('text');
                } else {
                    str = $this.text();
                }
            }
            
            calcCondition.apply(self);
            hide();
            
            self.$districtLabel.text(str).parent().addClass('active');
        });
        $('.filter .metro .child li').click(function(){
            var $this = $(this);
            $('.district-metro .child li').removeClass('active');
            $this.addClass('active');
            delete self.result.district;
            delete self.result.town;
            delete self.result.districtPinyin;
            delete self.result.longitude;
            delete self.result.latitude;
            delete self.result.meter;
            self.result.metro = $this.parent().data('value');
            self.result.station = $this.data('value');
            self.result.metroKey = $this.data('pinyin');
            calcCondition.apply(self);
            hide();
            var str = "";
            if(!self.result.station) {// 不限
                str = $this.parent().data('text');
            } else {
                str = $this.text();
            }
            self.$districtLabel.text(str).parent().addClass('active');
        });

        // 点击遮罩关闭筛选条件
        $('.content').click(function(event){
            if(this == event.target) {
                hide();
            }
        });
    }

    // 设置弹层的高度
    function setMaxHeight(){
        var winHeight = $(window).height();
        this.$districtMetro.find('.parent,.child').css('max-height', winHeight * .7 + "px");
        this.$price.find('ul').css('max-height', winHeight * .7 + "px");
        this.$houseType.find('.house-type-inner').css('max-height', winHeight * .7 + "px");
        this.$sort.css('max-height', winHeight * .7 + "px");
        this.$content.height(winHeight);
    }

    function getDistrictAndMetro(houseType, cityId, cb){
        initCount = 0;
        // 查询区域板块
        var self = this;
        this.controller.request(this.controller.apiUrl.rent.list.cityAreas,{
            houseType: this.options.houseType,
            cityId: this.options.cityId
        },{
            successCallback: function(data){
                self.options.districts = data.data;
                init.apply(self);
                console.log('area: success');
            },
            errorCallback: function(){
                self.options.districts = [];
                init.apply(self);
                console.log('area: error');
            },
            exceptionCallback: function(){
                self.options.districts = [];
                init.apply(self);
                console.log('area: exception');
            }
        });

        // 查询地铁
        this.controller.request(this.controller.apiUrl.rent.list.citySubway,{            
            cityId: this.options.cityId
        },{
            successCallback: function(data){
                self.options.metros = data.data;
                init.apply(self);
                console.log('subway: success');
            },
            errorCallback: function(){
                self.options.metros = [];
                init.apply(self);
                console.log('subway: error');
            },
            exceptionCallback: function(){
                self.options.metros = [];
                init.apply(self);
                console.log('subway: exception');
            }
        });
    }

    var initCount = 0;
    function init(){
        initCount++;        
        if(initCount!=2){// 获取区域和地铁是两个接口，因此这里要确定它们都已经成功返回了
            return;
        }
        this.$el.html(create.apply(this));
        this.$content = this.$el.find('.content');
        this.$body = $('body');
        // 筛选条中的内容
        this.$districtLabel = this.$el.find('.filter-items li:eq(0) .label');
        this.$priceLabel = this.$el.find('.filter-items li:eq(1) .label');
        this.$houseTypeLabel = this.$el.find('.filter-items li:eq(2) .label');
        this.$sortLabel = this.$el.find('.filter-items li:eq(3) .label');
        // 各个筛选条件的内容
        this.$districtMetro = this.$el.find('.district-metro');
        this.$price = this.$el.find('.total-price');
        this.$houseType = this.$el.find('.house-type');
        this.$sort = this.$el.find('.sort');
        // 
        this.$district = this.$districtMetro.find('.district');
        this.$metro = this.$districtMetro.find('.metro');
        this.$minPrice = this.$price.find('input:eq(0)');
        this.$maxPrice = this.$price.find('input:eq(1)');
        this.$priceConfirmBtn = this.$price.find('button');
        this.$houseTypeResetBtn = this.$houseType.find('.reset');
        this.$houseTypeConfirmBtn = this.$houseType.find('.confirm');

        
        //this.result = {};
        this.initValue = this.$el.data('init');
        if(this.initValue){
            this.initValue = JSON.parse(decodeURIComponent(this.initValue));
        }
        if(this.$el.length == 0) {
            throw "挂载点不存在";
        }
        
        this.setValue(this.initValue);
        bindEvent.apply(this);
        setMaxHeight.apply(this);
    }

    function Filter(options) {                
        this.options = $.extend({},DEFAULT, options);                            
        this.$el = $(options.el);
        this.controller = options.controller;        

        getDistrictAndMetro.apply(this);  
    }

    // 根据指定的值设置控件中各个筛选条件选中值
    Filter.prototype.setValue = function(value){
        /**
         * {
         *  district: "",
         *  town: "",
         *  metro: "",
         *  station: "",
         * 
         *  price: "",
         *  houseTypes:{
         *      key: []...
         *  },
         *  sort: ""
         * }
         */        
        // 区域/地铁
        var str = "";
        this.result = {};                
        if(value.district != undefined || value.town != undefined){            
            if(value.district != undefined) {
                str = this.$district.find('.parent li[data-value='+value.district+']').addClass('active').text();
                this.$district.find('.child ul[data-value='+value.district+']').show();
                this.result.district = value.district;
                this.result.districtPinyin = this.$district.find('.child ul[data-value='+value.district+'] li:eq(0)').data('pinyin');
            }
            if(value.town != undefined) {
                str = this.$district.find('.child li[data-value='+value.town+']').addClass('active').text();
                this.result.town = value.town;
                this.result.districtPinyin = this.$district.find('.child li[data-value='+value.town+']').data('pinyin');
            }                    
        } else if(value.metro != undefined || value.station != undefined){        
            if(value.metro != undefined) {
                str = this.$metro.find('.parent li[data-value='+value.metro+']').addClass('active').text();
                this.$metro.find('.child ul[data-value='+value.metro+']').show();
                this.result.metro = value.metro;
                this.result.metroKey = this.$metro.find('.child ul[data-value='+value.metro+'] li:eq(0)').data('pinyin');
            }
            if(value.station != undefined) {
                str = this.$metro.find('.child li[data-value='+value.station+']').addClass('active').text();
                this.result.station = value.station;
                this.result.metroKey = this.$metro.find('.child li[data-value='+value.station+']').data('pinyin');
            }

            $('.filter .district-metro >ul li').removeClass('active').filter(':eq(1)').addClass('active');
                       
            this.$district.hide();
            this.$metro.show();
        }else{// 清空选中的区域地铁
            this.$districtMetro.find('ul, li').removeClass('active');
            this.$districtMetro.find('.child ul').hide();
            this.$districtLabel.text('区域').parent().removeClass('active');
            this.$district.show();
            this.$metro.hide();
            this.$districtMetro.find('>ul li:eq(0)').addClass('active');
            delete this.result.district;
            delete this.result.districtPinyin;
            delete this.result.town;
            delete this.result.metro;
            delete this.result.metroKey;
            delete this.result.station;
        }
        if(str){// 设置选中区域或地铁站到区域内容中
            this.$districtLabel.text(str).parent().addClass('active');
        }

        // 总价
        if(value.price) {
            this.$price.find('li').removeClass('active');
            var $pr = this.$price.find('[data-value='+value.price+']');
            if($pr.length == 0){// 不是选项而是自定义价格
                var strs = value.price.split('to');
                var min = strs[0];
                var max = strs[1];
                this.$minPrice.val(min||"");
                this.$maxPrice.val(max||"");
                this.result.price = value.price;
                if(!min){
                    str = max + "万以下";
                } else if(!min){
                    str = min + "万以上";
                } else {
                    str = min + "-" + max + "万";
                }
            } else {// 选项                
                $pr.addClass('active');
                this.result.price = value.price;
                str = $pr.text();
            }
            this.$priceLabel.text(str).parent().addClass('active');
        }else{
            this.$price.find('li').removeClass('active');
            this.$maxPrice.val('');
            this.$minPrice.val('');
            this.$priceLabel.text('总价').parent().removeClass('active');
            delete this.result.price;
        }

        // 户型
        if(value.houseTypes){
            for(var key in value.houseTypes) {
                for(var i = 0; i < value.houseTypes[key].length; i++){
                    this.$houseType.find('[data-key='+key+'] [data-value='+value.houseTypes[key][i]+']').addClass('active');
                }                
            }

            this.$houseTypeLabel.parent().addClass('active');
        }else{
            this.$houseType.find('li').removeClass('active');
            this.$houseTypeLabel.text('户型').parent().removeClass('active');
        }

        // 排序
        if(value.sort){            
            var str = this.$sort.find('li[data-value='+value.sort+']').addClass('active').text();
            if(str){
                this.$sortLabel.text(str).parent().addClass('active');
            }
            this.result.sort = value.sort;
        }else{
            delete this.result.sort;
            this.$sort.find('li').removeClass('active');
            this.$sortLabel.text('排序').parent().removeClass('active');
        }
    }

    Filter.prototype.clear = function() {
        this.setValue({});        
        calcCondition.apply(this);
    }

    Filter.prototype.clearDistrictAndMetro = function(){
        this.$districtMetro.find('.parent li').removeClass('active');
        this.$districtMetro.find('.child li').removeClass('active');
        this.$districtLabel.text('区域').parent().removeClass('active');
        delete this.result.district;
        delete this.result.town;
        delete this.result.metro;
        delete this.result.station;
        delete this.result.districtPinyin;
        delete this.result.metroKey;
        delete this.result.meter;
        delete this.result.longitude;
        delete this.result.latitude;
    }

    return Filter;
});