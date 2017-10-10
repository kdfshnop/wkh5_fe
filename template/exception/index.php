<?php require_once("../global.php") ; ?>
<?php    
    $confs = array(
        "page_title" => "500" ,  //页面标题
        "match_stylesheet" => true ,  //是否需要匹配路由的样式表
        "extra_stylesheets" => array() ,  //除了默认加载的bootstrap.min.css以及app.min.css，还需要加载额外的样式表吗？有，请写在数组里面
        "extra_javascripts" => array()  //除了加载app.min.js | require.js | 本页控制器外，是否还需要预先加载其他资源
    ) ;    
?>
<?php require_once("../components/head.php") ; ?>
<?php require_once("../components/header.php") ; ?>
<?php require_once("../components/aside.php") ; ?>
<div class="content-wrapper">
    <div class="container-fluid">
       <h3 id="statusCode">404</h3>
       <p>错误名称</p>
       <p>错误描述错误描述错误描述错误描述错误描述</p>
    </div>
</div>
<?php require_once("../components/footer.php") ;  ?>