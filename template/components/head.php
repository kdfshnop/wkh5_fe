<!DOCTYPE html>
<html lang="zh-cn">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title><?php echo $confs["page_title"] ; ?> - 数据决策</title>
        <meta name="keywords" content="">
        <meta name="description" content=""> 
        <!-- 引入stylesheet资源 -->
         <link rel="stylesheet" href="<?php echo STATIC_DOMAIN ; ?>/ares_fe/css/<?php echo THEME ; ?>/app.min.css">  
        <script>
            var interval = setInterval(() => {
            var process = document.getElementById('progress');
            if (parseFloat(process.style.width) >= 95) {
                clearInterval(process);
            } else {
                process.style.width = parseFloat(process.style.width) + 1 + "%";
            }
        }, 30);
        </script>
        <?php if( sizeof($confs["extra_stylesheets"]) > 0 ) {
            for($m = 0 ; $m < sizeof($confs["extra_stylesheets"]) ; $m ++ ) {
        ?>
        <link rel="stylesheet" href="<?php echo $confs["extra_stylesheets"][$m] ; ?>">
        <?php } } ?>
        <?php
            if($confs["match_stylesheet"]) {
        ?>
         <link rel="stylesheet" href="<?php echo STATIC_DOMAIN ; ?>/ares_fe/css/<?php echo THEME ; ?>/<?php echo $router["controller"] ; ?>/<?php echo $router["method"] ; ?>.min.css">
        <?php } ?> 
    </head>
    <body>