<footer class="l-footer">
<?php
if ($_SERVER[ "HTTP_HOST" ] == 'real-connect.jp') {
  $production = true;
} else {
  $production = false;
};
$APP_HOST = $production ? "https://real-connect.jp" : "http://localhost:3002";
$USER_APP_HOST = $production ? "https://real-connect.jp" : "http://localhost:3000";
?>
  <nav class="l-footer__nav c-container">
    <h2 class="c-logo l-footer__logo">
      <a class="c-logo__body" href="<?php echo esc_url( home_url() ); ?>/">
        <span class="c-logo__symbol glyph glyph-brand-logo"></span>
        <span class="c-logo__text cft">Real-Connect</span>
      </a>
      <span class="c-logo__name">
        <span class="c-logo__product-tagline">リアルタイム・ソーシャルサービス</span>
        <em class="c-logo__product-name">りあこね</em>
      </span>
      <span class="c-logo__author">Produced by Real-Connect Inc.</span>
    </h2>

    <div class="l-footer__social">
      <div class="l-footer__social-inner">
        <?php if ( function_exists( 'ADDTOANY_SHARE_SAVE_KIT' ) ) { ADDTOANY_SHARE_SAVE_KIT(); } ?>
      </div>
    </div>

    <div class="l-footer-nav">
      <ul class="l-footer-nav__body">
        <li class="l-footer-nav__item">
          <a class="l-footer-nav__link" href="<?php echo esc_url( home_url() ); ?>/">
            <i class="glyph glyph-home"></i>
            HOME
          </a>
        </li>
        <li class="l-footer-nav__item">
          <a class="l-footer-nav__link" href="<?php echo esc_url( home_url() ); ?>/privacy-policy/">個人情報保護方針</a>
        </li>
        <li class="l-footer-nav__item">
          <a class="l-footer-nav__link" href="<?php echo esc_url( home_url() ); ?>/terms-of-service/">サービス利用規約</a>
        </li>
        <li class="l-footer-nav__item">
          <a class="l-footer-nav__link" href="<?php echo($APP_HOST); ?>/system_admin/place_application/create" target="_blank">店舗申請フォーム</a>
        </li>
        <li class="l-footer-nav__item">
          <a class="l-footer-nav__link" href="<?php echo($APP_HOST); ?>/system_admin/bulletin_board?tab=event" target="_blank">イベント掲示板</a>
        </li>
        <li class="l-footer-nav__item">
          <a class="l-footer-nav__link" href="<?php echo esc_url( home_url() ); ?>/contact/">お問合せ</a>
        </li>
        <li class="l-footer-nav__item">
          <a class="l-footer-nav__link" href="<?php echo($USER_APP_HOST); ?>/user/" target="_blank">ログイン</a>
        </li>
        <li class="l-footer-nav__item">
          <a class="l-footer-nav__link" href="<?php echo($USER_APP_HOST); ?>/user/?mode=register" target="_blank">新規登録</a>
        </li>
      </ul>
    </div>
  </nav>


  <div class="c-copyright">
    <span class="c-copyright__item">©<span class="c-copyright__text" data-begin-year="2018"><a class="c-copyright__link" href="/">Real-Connect Inc.</a> All right reserved.</span></span>
  </div>
</footer>

<?php
$http = is_ssl() ? 'https' . '://' : 'http' . '://';
$url = $http . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"];
?>

<?php if ( is_page('contact') ) : ?>
<script type="text/javascript">
document.addEventListener( "wpcf7mailsent", function( event ) {
  location = "<?php echo $url; ?>/send/";
}, false );
</script>
<?php endif; ?>

<?php /*
<script src="<?php echo get_stylesheet_directory_uri(); ?>/_assets/js/app.js"></script>
*/ ?>

<?php wp_footer(); ?>
</body>
</html>
