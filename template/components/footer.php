        <footer>
            ©2017 上海好居信息科技有限公司. All right reserved.
        </footer>
        <!--页面脚本区域-->
        <script src="<?php echo STATIC_DOMAIN ; ?>/ares_fe/config.js"></script>
        <script src="<?php echo STATIC_DOMAIN ; ?>/ares_fe/js/app.min.js"></script>
        <?php
            for( $n = 0 ; $n < sizeof($confs["extra_javascripts"]) ; $n ++ ) {
        ?>
        <script src="<?php echo $confs["extra_javascripts"][$n] ; ?>"></script>
        <?php } ?>
        <script data-main="<?php echo STATIC_DOMAIN ; ?>/ares_fe/js/<?php echo $router["controller"] ; ?>/<?php echo $router["method"] ; ?>.min" src="<?php echo STATIC_DOMAIN ; ?>/fe_public_library/wkzf/js/require.min.js"></script>  
        <script src="<?php echo STATIC_DOMAIN ; ?>/ares_fe/js/components/process.min.js"></script>   
    </body>
</html>