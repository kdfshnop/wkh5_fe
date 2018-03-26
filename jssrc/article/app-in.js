// /*-----------------------------------------------------------------------------------------------------------
// 1.项目名称：悟空找房H5
// 2.页面名称：发现详情信息(discoveryDetails.php)
// 3.作者名称：luwei@lifang.com
// -----------------------------------------------------------------------------------------------------------*/
// define([
//     'jQuery',
//     'lib/ui/class',
//     'service/discovery/operation',
//     'pullload',
//     'wechatAudio'], function ($, Class, Operation) {
//     var subclass = {
//       setOptions: function (opts) {
//         var defaults = {
//           listUrl: '/article/queryArticleCommentList.rest',
//           container: $('.comment-list')
//         }
//         $.extend(true, this.options = {}, defaults, opts)
//       }
//     }
//     var parentclass = {
//       init: function (opts) {
//         // 设置参数
//         this.setOptions(opts)
//         this.setArticleFont()
//         // 初始化操作
//         this.Operation = Operation
//         this.articleId = $.trim($('#articleId').val())
//         // 初始化评论列表
//         this.getList()
//         this.convertVideo()
  
//         // 注册一个全局函数，解决android webview 中音频播放，app切换出去，音频仍在播放的问题
//         window.pauseAudio = function () {
//           $('audio').each(function (i, el) {
//             el.pause()
//           })
//           $('.audio_area').removeClass('playing')
//         }
  
//         if (location.href.indexOf('#') > 0) {
//           if (location.href.slice(location.href.lastIndexOf('#')) == '#comment-box') {
//             clearTimeout(st)
//             var st = setTimeout(function () {
//               $('html,body').scrollTop($('#comment-box').offset().top - 200)
//             }, 300)
//           }else{
//           }
//         }else{
//         }
//       },
//       initPullload: function () {
//         var classSelf = this
  
//         classSelf.options.container.pullload({
//           apiUrl: classSelf.options.listUrl + '?articleId=' + classSelf.articleId + '&pageSize=10',
//           threshold: 0,
//           callback: function (resp) {
//             if (resp.data && resp.data.length) {
//               classSelf.createCommentList(resp)
//             }
//           },
//           requestLoadedKey: 'pageIndex',
//           isShowLoadingTips: false
//         })
//       },
//       convertVideo: function () {
//         var videos = $('.article-content').find('embed')
//         if (!videos || !videos.length) return false
//         $.each(videos, function (index, item) {
//           var $item = $(item)
//           var coverUrl = $.trim($('#coverUrl').val())
//           var $video, audio
//           var src = $item.attr('src')
//           var split = src && src.split('.')
//           var type = split[split.length - 1]
//           if (type.toLowerCase() === 'mp3') {
//             audio = '<p class="weixinAudio">'
//             audio += '<audio src="' + src + '" id="media" width="1" height="1" preload="auto"></audio>'
//             audio += '<span id="audio_area" class="db audio_area">'
//             audio += '<span class="audio_arrow_back"></span>'
//             audio += '<span class="audio_arrow"></span>'
//             audio += '<span class="audio_wrp db">'
//             audio += '<span class="audio_play_area">'
//             audio += '<i class="icon_audio_default"></i>'
//             audio += '<i class="icon_audio_playing"></i>'
//             audio += '</span>'
//             audio += '<span id="audio_progress" class="progress_bar"></span>'
//             audio += '</span>'
//             audio += '</span>'
//             audio += '<span id="audio_length" class="audio_length tips_global"></span>'
//             audio += '</p>'
//             $item.after($(audio))
//             $item.remove()
//           } else {
//             $video = $('<video src="' + $item.attr('src') + '" controls="controls">您的浏览器不支持 video 标签。</video>')
//             $video.attr({poster: coverUrl, preload: 'auto'})
//             $item.attr({'type': '', 'width': '100%', 'height': '100%'})
//             $item.after($video)
//             $item.remove()
//           }
//           $('.weixinAudio').wechatAudio({
//             autoplay: false
//           })
//         })
//       },
//       getList: function () {
//         var classSelf = this
//         var requestData = {
//           articleId: classSelf.articleId,
//           pageSize: 10,
//           pageIndex: 0
//         }
  
//         $.ajax({
//           type: 'get',
//           url: '//' + window.location.host + classSelf.options.listUrl,
//           dataType: 'json',
//           data: requestData,
//           success: function (resp) {
//             if (resp != null) {
//               if (resp.data && resp.data.length) {
//                 classSelf.createCommentList(resp)
//                 classSelf.initPullload()
//               }
//             } else {
//               console.error('response data is null')
//             }
//           },
//           error: function (xhr, type) {
//             console.log('ajax error')
//           }
//         })
//       },
//       setArticleFont: function () {
//         var isIPhone = window.navigator.appVersion.match(/iphone/gi)
//         if (isIPhone) {
//           var dpr = parseInt($('[data-dpr]').attr('data-dpr')) || 1
//           $('.article-content').find('[style*=font-size]').each(function(index, ele) {
//             $(ele).css('font-size',$(ele)[0].style.fontSize.replace('px','') * dpr + 'px');
//             //$(ele).css('font-size', $(ele).css('font-size').replace('px', '') * dpr + 'px')
//           })
//         }
//         $('.article-content').show()
//       },
//       createCommentList: function (result) {
//         var html = []
//         if (!result.data || !result.data.length) return false
//         $.each(result.data, function (index, item) {
//           html.push('<div class="item">')
//           html.push('<div class="commenter pb-10">')
//           html.push('<img src="' + item.guestPhoto + '" alt="">')
//           html.push('<span class="name">' + (item.guestNickname ? item.guestNickname.replace(':', '') : '') + '</span>')
//           html.push('</div>')
//           html.push('<div class="content pb-10">' + item.commentContent + '</div>')
//           html.push('<div class="datetime">')
//           html.push('<span class="date">' + item.date + '</span>')
//           html.push('<span class="time">' + item.time + '</span>')
//           html.push('</div>')
//           html.push('</div>')
//         })
//         $('.comment-list').append(html.join(''))
//       }
//     }
//     var details = Class.create(
//       subclass,
//       parentclass
//     )
//     return details
//   })
  