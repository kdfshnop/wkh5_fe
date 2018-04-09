/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：article/app-share(取经文章-分享页)
 3. 作者：tangxuyang@lifang.com
 4. 从wkwap_fe中移过来的，简单修改
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

 // 取自pagination.js
 class Pagination {
     constructor(options) {
        this.setOptions(options);
        this.options.callback();
        this.bindEvent();
     }

    setOptions(opt) {
        var defaults = {
          total: 1,
          prePages: 5, // 没有前置[...]显示5页
          sufPages: 4, // 没有后置[...]显示4页
          dotsPages: 7, // 7页后显示[...]
          showDotPages: 3, // 前后3页之后显示[...]  
          sidePages: 1, // 中间前后各加1页
          callback: null,
          container: null,
          numberStyle: ''
        };
        $.extend(true, this.options = {}, defaults, opt);
    }
 
    genPageNumber(pageIndex, totalCount) {
        var _this = this;
        var prePages = _this.options.prePages; // 没有前置[...]显示5页
        var sufPages = _this.options.sufPages; // 没有后置[...]显示4页
        var dotsPages = _this.options.dotsPages; // 7页后显示[...]
        var showDotPages = _this.options.showDotPages; // 前后3页之后显示[...]  
        var sidePages = _this.options.sidePages; // 中间前后各加1页
        var total = totalCount || _this.options.total;
        var numberStyle = _this.options.numberStyle;
        var str = "<a href='javascript:;' class='" + numberStyle + " page-link on'>" + pageIndex + '</a>';
        if (total < dotsPages) {
          for (var i = pageIndex - 1; i >= 1; i--) {
            str = "<a href='javascript:;' class='" + numberStyle + " page-link'>" + i + '</a>' + str;
          }
          for (var i = pageIndex + 1; i <= total; i++) {
            str = str + "<a href='javascript:;' class='" + numberStyle + " page-link'>" + i + '</a>';
          }
        } else {
          if (pageIndex < showDotPages + 1) {
            for (var i = pageIndex - 1; i >= 1; i--) {
              str = "<a href='javascript:;' class='" + numberStyle + " page-link'>" + i + '</a>' + str;
            }
            for (var i = pageIndex + 1; i <= prePages; i++) {
              str = str + "<a href='javascript:;' class='" + numberStyle + " page-link'>" + i + '</a>';
            }
            str = str + '<span>...</span>';
            str = str + "<a href='javascript:;' class='" + numberStyle + " page-link'>" + total + '</a>';
          } else if (total - pageIndex < showDotPages) {
            for (var i = pageIndex + 1; i <= total; i++) {
              str = str + "<a href='javascript:;' class='" + numberStyle + " page-link'>" + i + '</a>';
            }
            for (var i = pageIndex - 1; i > total - sufPages; i--) {
              str = "<a href='javascript:;' class='" + numberStyle + " page-link'>" + i + '</a>' + str;
            }
            str = '<span>...</span>' + str
            str = "<a href='javascript:;' class='" + numberStyle + " page-link'>" + 1 + '</a>' + str;
          } else {
            for (var i = 1; i <= sidePages; i++) {
              if (pageIndex - i > 1) {
                str = "<a href='javascript:;' class='" + numberStyle + " page-link'>" + (pageIndex - i) + '</a>' + str;
              }
              if (pageIndex - 0 + i <= total) {
                str = str + "<a href='javascript:;' class='" + numberStyle + " page-link'>" + (pageIndex - 0 + i) + '</a>';
              }
            }
            if (pageIndex - sidePages > 1) {
              str = "<a href='javascript:;' class='page-link'>" + 1 + '</a>' + '<span>...</span>' + str;
            }
            if (pageIndex + sidePages < total) {
              str = str + '<span>...</span>' + "<a href='javascript:;' class='" + numberStyle + " page-link'>" + total + '</a>';
            }
          }
        }
        if (pageIndex == 1) {
          str = "<a href='javascript:;' data-type='pre' data-pageindex='" + pageIndex + "' class='page-link disabled'>上一页</a>" + str;
        } else {
          str = "<a href='javascript:;' data-type='pre' data-pageindex='" + pageIndex + "' class='page-link'>上一页</a>" + str;
        }
  
        if (pageIndex == total) {
          str = str + "<a href='javascript:;' data-type='next' data-pageindex='" + pageIndex + "' class='page-link disabled'>下一页</a>";
        } else {
          str = str + "<a href='javascript:;' data-type='next' data-pageindex='" + pageIndex + "' class='page-link'>下一页</a>";
        }
        _this.options.container.append(str);
    }
    
    bindEvent() {
        var _this = this;
        _this.options.container.undelegate('a', 'click').delegate('a', 'click', function (event) {
          var $this = $(this);
          var pageIndex = parseInt($this.text());
          var type = $this.data('type');
          var oldIndex = parseInt($this.attr('data-pageindex'));
          if ($this.hasClass('disabled') || $this.hasClass('on')) return;
          switch (type) {
            case 'pre':
              pageIndex = oldIndex - 1;
              break;
            case 'next':
              pageIndex = oldIndex + 1;
              break;
            default:
              break;
          }
          if (!pageIndex) return;
          _this.options.callback && _this.options.callback(pageIndex);
        });
      }
} 
  
// 取自wechatAudio.js
;
(function($) {
    'use strict';

    /*-----------------------------------------------------------------------------------------------------------
    定义插件的构造方法
    @param element 选择器对象
    @param options 配置项
    @constructor
    -----------------------------------------------------------------------------------------------------------*/
    var Plugin = function(element, options) {
        //将选择器对象赋值给插件，方便后续调用
        this.$element = $(element);

        this.$Audio = this.$element.children('#media');
        this.Audio = this.$Audio[0];
        this.$audio_area = this.$element.find('#audio_area');
        this.$audio_length = this.$element.find('#audio_length');
        this.$audio_progress = this.$element.find('#audio_progress');
        //属性
        this.currentState = 'pause';
        this.time = null;
        //合并参数设置
        this.options = $.extend({}, Plugin.defaults, options);
        //进行一些初始化工作
        this.init();
    };

    /*-----------------------------------------------------------------------------------------------------------
    插件名称，即调用时的名称（$.fn.pluginName）
    @type {string}
    -----------------------------------------------------------------------------------------------------------*/
    Plugin.pluginName = "wechatAudio";

    /*-----------------------------------------------------------------------------------------------------------
    插件缓存名称，插件通过 data 方法缓存在 dom 结构里，存储数据的名称
    @type {string}
    -----------------------------------------------------------------------------------------------------------*/
    Plugin.dataName = "wechataudio";

    /*-----------------------------------------------------------------------------------------------------------
    插件版本
    @type {string}
    -----------------------------------------------------------------------------------------------------------*/
    Plugin.version = "1.0.0";

    /*-----------------------------------------------------------------------------------------------------------
    插件默认配置项
    @type {{}}
    -----------------------------------------------------------------------------------------------------------*/
    Plugin.defaults = {
        autoplay: false,
        src: '',
        callback: $.noop
    };

    /*-----------------------------------------------------------------------------------------------------------
    定义私有方法
    -----------------------------------------------------------------------------------------------------------*/
    var privateMethod = {

    };

    /*-----------------------------------------------------------------------------------------------------------
    定义插件的方法
    @type {{}}
    -----------------------------------------------------------------------------------------------------------*/
    Plugin.prototype = {
        init: function() {
            var self = this;
            self.Audio.addEventListener('durationchange', function(e) {
                self.updateTotalTime(e.target.duration);
                console.log(e.target.duration); //FIRST 0, THEN REAL DURATION
            });
            // window.addEventListener('load',function(){
            //     self.updateTotalTime();
            // })
            self.events();
            // 设置src
            if (self.options.src !== '') {
                self.changeSrc(self.options.src, this.options.callback);
            }
            // 设置自动播放
            if (self.options.autoplay) {
                self.play();
            }
        },
        play: function() {
            var self = this;
            if (self.currentState === "play") {
                self.pause();
                return;
            }
            self.Audio.play();
            clearInterval(self.timer);
            self.timer = setInterval(self.run.bind(self), 50);
            self.currentState = "play";
            self.$audio_area.addClass('playing');
        },
        pause: function() {
            var self = this;
            self.Audio.pause();
            self.currentState = "pause";
            clearInterval(self.timer);
            self.$audio_area.removeClass('playing');
        },
        stop: function() {

        },
        events: function() {
            var self = this;
            var updateTime;
            self.$audio_area.on('click', function() {
                self.play();
                if (!updateTime) {
                    self.updateTotalTime();
                    updateTime = true;
                }
            });
        },
        //正在播放
        run: function() {
            var self = this;
            self.animateProgressBarPosition();
            if (self.Audio.ended) {
                self.pause();
            }
        },
        //进度条
        animateProgressBarPosition: function() {
            var self = this,
                percentage = (self.Audio.currentTime * 100 / self.Audio.duration) + '%';
            if (percentage == "NaN%") {
                percentage = 0 + '%';
            }
            var styles = {
                "width": percentage
            };
            self.$audio_progress.css(styles);
        },
        //获取时间秒
        getAudioSeconds: function(string) {
            var self = this,
                string = string % 60;
            string = self.addZero(Math.floor(string), 2);
            (string < 60) ? string = string: string = "00";
            return string;
        },
        //获取时间分
        getAudioMinutes: function(string) {
            var self = this,
                string = string / 60;
            string = self.addZero(Math.floor(string), 2);
            (string < 60) ? string = string: string = "00";
            return string;
        },
        //时间+0
        addZero: function(word, howManyZero) {
            var word = String(word);
            // while (word.length < howManyZero) word = "0" + word;
            return word;
        },
        //更新总时间
        updateTotalTime: function(time) {
             var self = this,
                time = time || self.Audio.duration,
                minutes = self.getAudioMinutes(time),
                seconds = self.getAudioSeconds(time),
                audioTime = '';
                if(minutes == "00"){
                    audioTime = seconds + "''"
                }else{
                    audioTime = minutes + "'" + seconds + "''";
                }
                self.$audio_length.text(audioTime);
        },
        //改变音频源
        changeSrc: function(src, callback) {
            var self = this;
            self.pause();
            self.Audio.src = src;
            self.play();
            callback();
            return this;
        },

    };

    /*-----------------------------------------------------------------------------------------------------------
    缓存同名插件
    -----------------------------------------------------------------------------------------------------------*/
    var old = $.fn[Plugin.pluginName];

    /*-----------------------------------------------------------------------------------------------------------
    定义插件，扩展$.fn，为jQuery对象提供新的插件方法
    调用方式：$.fn.pluginName()
    @param option {string/object}
    @param args {string/object}
    -----------------------------------------------------------------------------------------------------------*/
    $.fn[Plugin.pluginName] = function(option, args) {
        return this.each(function() {
            var $this = $(this);

            var data = $this.data(Plugin.dataName);
            var options = typeof option == 'object' && option;

            //只实例化一次，后续如果再次调用了该插件时，则直接获取缓存的对象
            if (!data) {
                $this.data(Plugin.dataName, (data = new Plugin(this, options)));
            }
            //如果插件的参数是一个字符串，则直接调用插件的名称为此字符串方法
            if (typeof option == 'string') data[option](args);
            return this;
        });
    };

    $.fn[Plugin.pluginName].Constructor = Plugin;

    /*-----------------------------------------------------------------------------------------------------------
    为插件增加 noConflict 方法，在插件重名时可以释放控制权
    @returns {*}
    -----------------------------------------------------------------------------------------------------------*/
    $.fn[Plugin.pluginName].noConflict = function() {
        $.fn[Plugin.pluginName] = old;
        return this
    };
})(window.Zepto || window.jQuery);

class ArticleShareController extends Controller {
    constructor(opts){
        super();

        var self = this;
        require(['../components/bigdata.min'], function(BigData){
            BigData.init(self);
            BigData.bigData({
                "pageName": "1022",
                "pageParam":{
                    "article_id": $.trim($('#articleId').val())
                },            
                "type": 1
            });
            self.BigData = BigData;
        });

        // 设置参数
        this.setOptions(opts)
        this.setArticleFont()
          // 初始化操作        
        this.articleId = $.trim($('#articleId').val())
        this.cityId = $.trim($('#cityId').val())
          // 初始化评论列表
        this.refreshComment()
          // 绑定事件
        this.bindEvent()
        this.convertLink()
        this.convertVideo()
        this.openInApp()
        this.initWxShare()
        this.loginStatus = false
        this.textareaHeight = $('.commentArea').find('textarea').height()
        this.wkBigDataParams = {
          pageName: 1022,
          pageParam: {
            article_id: this.articleId
          },
          eventName: '',
          eventParam: {},
          nextPageName: '',
          nextPageParam: {},
          city: $('#cityId').val()
        }
  
        // 如果hash=="#comment-box",表示从栏目列表页跳转过来且已判断了用户是否登录了
        // 则评论的输入框获取焦点
        if (location.href.indexOf('#') > 0) {
          if (location.href.slice(location.href.lastIndexOf('#')) == '#comment-box') {
            clearTimeout(st)
            var st = setTimeout(function() {
              $('html,body').scrollTop($('#comment-box').offset().top - 200)
            }, 300)
          }
        }
    }

    initWxShare() {
        // var classSelf = this
        // var wxShare = new WxShare({
        //   successCB: function() {
        //     classSelf.Operation.share({
        //       articleId: classSelf.articleId
        //     })
        //   }
        // })

        // 微信分享功能已经打包进了app.min.js中，会自动在页面中寻找id为wechatTitle、wechatContent和wechatImgUrl的隐藏域，分别对应微信分享的标题、内容和图片！
    }

    openInApp() {
        // 项目中【打开App】是一个组件，.download-app .download是这个组件使用的class
        //nativeSchema是lib/wakeupApp提供的功能，已经打包到app.min.js中了，直接用就好了
        var cityId = this.cityId;
        var articleId = this.articleId;
        $(".download-app .download").click(()=> {
            nativeSchema.loadSchema({               
                schema : "external_call/parameter?t=0&bt=30&cd=" + cityId + "&articleId="+ articleId ,  // 通过NN打开某个链接
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
        // var app = new App({
        //     element: '.downbtn',
        //     androidSchemes: 'wkzf://external_call/parameter?t=0&bt=30&cd=' + this.cityId + '&articleId=' + this.articleId,
        //     isoSchemes: 'wkzf://external_call/parameter?t=0&bt=30&cd=' + this.cityId + '&articleId=' + this.articleId,
        //     androidDownloadLink: '/download/transit?from=articleDetail',
        //     iosDownloadLink: '/download/transit?from=articleDetail'
        // })
    }

    getQueryString(params, name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = params.match(reg); // 获取url中"?"符后的字符串并正则匹配
        var context = '';
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == '' || context == 'undefined' ? '' : context;
    }


    convertLink() {
        var classSelf = this;
        var links = $('.article-content').find('a');// 找出.article-content中所有的a标签
        if (!links || !links.length) return false;
        $.each(links, function(index, item) {// 遍历所有a标签，对其进行处理
            var $item = $(item);
            var href = $item.attr('href');
            if(!href) return;
            var params = href.split('?');
            var articleId, categoryId;
            if (params) {
            if (params[0] === 'wkzf://discovery/parameter?articleId=') {// 我读书少，这里怎么还能有问号，不是用问号分割的吗，先保留吧
                if (params[1]) {
                articleId = classSelf.getQueryString(params[1], 'articleId')
                $item.attr('href', '/article/app-share.' + articleId + '.html')
                }
            } else if (params[0] === 'wkzf://discovery/parameter?categoryId=') {
                if (params[1]) {
                categoryId = classSelf.getQueryString(params[1], 'categoryId')
                $item.attr('href', '/category/app.' + categoryId + '.html?cityId=' + classSelf.cityId)
                }
            }
            }
        })
    }


    convertVideo() {
        var videos = $('.article-content').find('embed');
        if (!videos || !videos.length) return false;
        $.each(videos, function(index, item) {
            var $item = $(item);
            var coverUrl = $.trim($('#coverUrl').val());
            var $video, audio;
            var src = $item.attr('src');
            var split = src && src.split('.');
            var type = split[split.length - 1];
            if (type.toLowerCase() === 'mp3') {
                audio = '<p class="weixinAudio">';
                audio += '<audio src="' + src + '" id="media" width="1" height="1" preload="auto"></audio>';
                audio += '<span id="audio_area" class="db audio_area">';
                audio += '<span class="audio_arrow_back"></span>';
                audio += '<span class="audio_arrow"></span>';
                audio += '<span class="audio_wrp db">';
                audio += '<span class="audio_play_area">';
                audio += '<i class="icon_audio_default"></i>';
                audio += '<i class="icon_audio_playing"></i>';
                audio += '</span>';
                audio += '<span id="audio_progress" class="progress_bar"></span>';
                audio += '</span>';
                audio += '</span>';
                audio += '<span id="audio_length" class="audio_length tips_global"></span>';
                audio += '</p>';
                $item.after($(audio));
                $item.remove();
            } else {
                $video = $('<video src="' + $item.attr('src') + '" controls="controls">您的浏览器不支持 video 标签。</video>');
                $video.attr({
                    poster: coverUrl,
                    preload: 'auto'
                });
                $item.attr({
                    'type': '',
                    'width': '100%',
                    'height': '100%'
                });
                $item.after($video);
                $item.remove();
            }
            $('.weixinAudio').wechatAudio({
                autoplay: false
            });
        });
    }

    refreshComment() {
        var classSelf = this;
        var PN = new Pagination({
            prePages:4,
            callback: function(pageIndex) {
                pageIndex = pageIndex || 1
                var itemIndex = (pageIndex - 1) * 10
                classSelf.request(classSelf.apiUrl.essay.commentList, {
                    articleId: classSelf.articleId,
                    pageIndex: itemIndex
                },{
                    successCallback: function(result){
                        classSelf.createCommentList(result)
                        $('.pagination').empty()
                        if (!result.count) {
                        $('.pagination').hide()
                        return false
                        } else {
                        $('.pagination').show()
                        }
                        PN.genPageNumber(pageIndex, Math.ceil(result.count / 10))
                    }
                });               
            },
            container: $('.pagination'),
            numberStyle: 'page-number'
        });
    }
    createCommentList(result) {
        var html = [];
        if (!result.data || !result.data.length) return false;
        $('.comment-list').empty();
        $.each(result.data, function(index, item) {
            html.push('<div class="item">');
            html.push('<div class="commenter pb-10">');
            html.push('<img src="' + item.guestPhoto + '" alt="">');
            html.push('<span class="name">' + (item.guestNickname ? item.guestNickname.replace(':', '') : '') + '</span>');
            html.push('</div>');
            html.push('<div class="content pb-10">' + item.commentContent + '</div>');
            html.push('<div class="datetime">');
            html.push('<span class="date">' + item.date + '</span>');
            html.push('<span class="time">' + item.time + '</span>');
            html.push('</div>');
            html.push('</div>');
        })
        $('.comment-list').append(html.join(''));
    }

    setArticleFont() {
        // 不再采用lib-flexible，同时prd要求所有字体都是16px，黑体，1.75行高。在css中用!important覆盖了所有的.article-content中所有的元素了的样式了
        // var isIPhone = window.navigator.appVersion.match(/iphone/gi)
        // if (isIPhone) {
        //     var dpr = parseInt($('[data-dpr]').attr('data-dpr')) || 1
        //     $('.article-content').find('[style*=font-size]').each(function(index, ele) {
        //     $(ele).css('font-size',$(ele)[0].style.fontSize.replace('px','') * dpr + 'px');
        //     //$(ele).css('font-size', $(ele).css('font-size').replace('px', '') * dpr + 'px')
        //     })
        // }
        $('.article-content [style]').removeAttr('style').removeAttr('class');
        $('.article-content').show();
    }

    bindEvent() {
        var classSelf = this;
        // 收藏功能，当前没有登录所以隐去
        $('.collect').on('click', function() {
            var _ = $(this);
            var $icon = _.find('i').first();
            Login.isLoginCheck(function() {
                if ($icon.hasClass('icon-shoucang')) {
                    classSelf.Operation.collect({
                        articleId: classSelf.articleId
                    }, function() {
                        $icon.removeClass('icon-shoucang').addClass('icon-yishoucang');
                        classSelf.Operation.showMessage('收藏成功，可至APP收藏中查看！');
                        classSelf.wkBigDataParams.eventName = 1022001;
                        classSelf.wkBigDataParams.eventParam = {
                            article_id: classSelf.articleId,
                            collect: 1
                        };
                        lifang.sendWKBigData(classSelf.wkBigDataParams);
                    });
                }
                if ($icon.hasClass('icon-yishoucang')) {
                    classSelf.Operation.cancelCollection({
                        articleId: classSelf.articleId
                    }, function() {
                        $icon.removeClass('icon-yishoucang').addClass('icon-shoucang');
                        classSelf.wkBigDataParams.eventName = 1022001;
                        classSelf.wkBigDataParams.eventParam = {
                            article_id: classSelf.articleId,
                            collect: 0
                        };
                        lifang.sendWKBigData(classSelf.wkBigDataParams);
                    });
                }
            });
        });

        // 下载app的条
        this.addListenerToDownloadApp();

        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        下载条的关闭按钮事件赋予
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $(".download-app .icon-remove").click(function(){
            $(".details-container").css({ "padding-bottom" : 50 }) ;
        }) ;
        $(".download-app dl").click(function(){
            var categoryId = $('#categoryId').val();
            var cityId = $('#cityId').val();
            location.href = "/category/app."+ categoryId +".html?cityId=" + cityId;
            classSelf.BigData.bigData({
                "pageName": "1022005",
                "pageParam":{
                    "article_id": classSelf.articleId
                },            
                "type": 2
            });
        });
        
        // var myElement = $('.details-container');
        // var mc = new Hammer(myElement[0]);

        // mc.on('panup', function() {
        //     if ($('body').scrollTop() > 200) {
        //         $('.discovery-download').hide(0);
        //     }
        // });

        // mc.on('pandown', function() {
        //     $('.discovery-download').show(0);
        // });

        $('.zan').on('click', function() {
            var _ = $(this);
            var $icon = _.find('i').first();

            if (_.hasClass('active')) {                
                $.tips('您已经赞过', 2);
                return;
            }

            //if ($icon.hasClass('icon-appraise')) {                
                // classSelf.wkBigDataParams.eventName = 1022003;
                // classSelf.wkBigDataParams.eventParam = {
                //     article_id: classSelf.articleId
                // };
                // lifang.sendWKBigData(classSelf.wkBigDataParams);               

                classSelf.request(classSelf.apiUrl.essay.zan, {
                    articleId: classSelf.articleId
                },{
                    successCallback: function(data){
                        if(data.status ===1 && data.data){
                            var zanCount = _.children('span').text() || 0;
                            if(/^\d*$/.test(zanCount)){
                                if(parseInt(zanCount)<9999){
                                    zanCount = parseInt(zanCount)+1;
                                }else{
                                    zanCount = '1万+';
                                }
                            }else{
                                zanCount = _.text();
                            }
                            _.addClass('active').find('span').text(data.data);
                           
                        }else{
    
                        }
                    }
                });  
        });

        $('[name="comment"]').keyup(function() {
            var _ = $(this);
            var val = _.val();
            //console.log(this.scrollHeight);
            //_.height(this.scrollHeight);
            if (val && val.length > 0) {
                _.parent().css('border-color', '#76B4E8');
                $('.comment .submit').css({
                    'color': '#4081D6',
                    'border-color': '#4081D6'
                });
            } else {
                _.parent().css('border-color', '#E4E4E4')
                $('.comment .submit').css({
                    'color': '#999',
                    'border-color': '#999'
                });
            }
        });

        $('.comment').on('click', '.cancel', function() {
            var com = $('[name="comment"]');
            com.val('').height(classSelf.textareaHeight || 75);
            com.parent().css('border-color', '#E4E4E4');
            $('.comment .submit').css({
                'color': '#999',
                'border-color': '#999'
            });
        });

        var commiting = false;
        //评论提交事件
        $('.comment').on('click', '.submit', function(event) {
            event.preventDefault();
            if(commiting){
                return;
            }

            var $textarea = $('[name=comment]');

            var comment = $.trim($textarea.val());
            if (comment.length === 0) {                
                $.tips('评论内容不能为空', 1);
                return false;
            }     

            $('.comment .submit').css({
                'color': '#999',
                'border-color': '#999'
            });
            commiting = true;
            classSelf.request(classSelf.apiUrl.essay.comment, {
                articleId: classSelf.articleId,
                comment: comment
            },{
                successCallback: function(data){                    
                    $('.comment .submit').css({
                        'color': '#4081D6',
                        'border-color': '#4081D6'
                    });
                    commiting = false;
                    if(data.status===1 && data.data){                        
                        $.tips('评论成功', 2);                        
                        var $count = $('#comment-box').find('.count');
                        var count = parseInt($count.text()) || 0;
                        var text = $count.text();
                        if (count) {
                            if(data.data.commentNumStr){
                                $count.text(data.data.commentNumStr)
                            }else{
                                if(/^\d*$/.test(text)){
                                    if(parseInt(text)<9999){
                                        $count.text(parseInt(text) + 1)
                                    }else{
                                        $count.text('1万+');
                                    }
                                }
                            }
                        } else {
                            $('#comment-box').find('.title').empty().append('评论（<span class="count">1</span> )');
                        }
                        $('.no-commet').remove();
                        $textarea.val('');
                        $('.comment .submit').css({
                            'color': '#999',
                            'border-color': '#999'
                        });
                        $('html,body').scrollTop($('#comment-box').offset().top - 200);                        
                        // classSelf.wkBigDataParams.eventName = 1022002;
                        // classSelf.wkBigDataParams.eventParam = {
                        //     article_id: classSelf.articleId
                        // };
                        // lifang.sendWKBigData(classSelf.wkBigDataParams);
                        classSelf.refreshComment();
                    }else{                        
                        $.tips('评论失败', 2);
                    }
                }
            });            
        });

        window.addEventListener('resize', function(e) {
            var $comment = $('[name="comment"]');
            $comment.scrollIntoView(false);
        });
    }

    setOptions(opts) {
        var defaults = {};
        $.extend(true, this.options = {}, defaults, opts);
    }
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new ArticleShareController;
});