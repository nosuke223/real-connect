<!DOCTYPE html>
<html lang="ja">
<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#">
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="format-detection" content="telephone=no">
<?php if(is_front_page()): ?>
<title><?php bloginfo('name'); ?> | <?php bloginfo('description'); ?></title>
<?php elseif ( is_search() ): ?>
<title>Search | <?php echo bloginfo('name'); ?></title>
<?php else: ?>
<title><?php echo trim(wp_title('', false)); ?> | <?php bloginfo('name'); ?></title>
<?php endif; ?>
<?php if(get_field('cv_description')): ?>
<meta name="description" content="<?php the_field('cv_description'); ?>">
<?php elseif(SCF::get_option_meta( 'theme-options', 'description' )): ?>
<meta name="description" content="<?php echo SCF::get_option_meta( 'theme-options', 'description' ); ?>">
<?php endif; ?>
<?php if(is_front_page() && SCF::get_option_meta( 'theme-options', 'keyword' )): ?>
<meta name="keywords" content="<?php echo SCF::get_option_meta( 'theme-options', 'keyword' ); ?>">
<?php elseif(get_field('cv_keyword_enable') && get_field('cv_keyword')): ?>
<meta name="keywords" content="<?php the_field('cv_keyword'); ?>">
<?php endif; ?>
<?php if(get_field('cv_noindex')): ?>
<meta name='robots' content='noindex,follow'>
<?php endif; ?>
<!--[if lt IE 9]>
<script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv-printshiv.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js"></script>
<![endif]-->

<link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri(); ?>/_assets/css/theme.css">
<link rel="shortcut icon" href="<?php echo get_stylesheet_directory_uri(); ?>/_assets/img/favicon/favicon.ico">
<link rel="apple-touch-icon" href="<?php echo get_stylesheet_directory_uri(); ?>/_assets/img/common/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="りあこねinfo">
<link rel="manifest" href="<?php echo get_stylesheet_directory_uri(); ?>/_manifest/manifest.json">
<meta name="theme-color" content="#7280FF">
<link rel="canonical" href="<?php
$url = $_SERVER["REQUEST_URI"];
$parse_url = parse_url($url, PHP_URL_PATH);
echo ( "https://" . $_SERVER[ "HTTP_HOST" ] . $parse_url );
?>">

<?php
if ($_SERVER[ "HTTP_HOST" ] == 'real-connect.jp') {
  $production = true;
} else {
  $production = false;
};
if (!is_user_logged_in()) {
  $guest = true;
} else {
  $guest = false;
};
$APP_HOST = $production ? "https://real-connect.jp" : "http://realconnect.ddns.net:3002";
$USER_APP_HOST = $production ? "https://real-connect.jp" : "http://realconnect.ddns.net:3000";
?>
<?php
// 本番環境かつWPにログインしていないユーザのみ、
// Google Tag Manager をトラッキングする。
if(SCF::get_option_meta( 'theme-options', 'gtm' )):
?>
<!-- BEGIN Google Tag Manager-->
<?php
if ($production&&$guest) {
  echo SCF::get_option_meta( 'theme-options', 'gtm' );
  echo "\n";
} else {
?>
<!--
* Note: *
This is the same as tracking-code before renewal.（2019-01）
- Logged in user exclusion: Enable
-->
<?php
};
?>
<!-- END Google Tag Manager-->
<?php endif; ?>

<?php get_template_part( 'open-graf' ); ?>

<?php wp_head(); ?>
<?php if ( is_admin_bar_showing() ): ?><style media="screen">html {margin-top: 0 !important; padding-top: 32px !important}@media screen and ( max-width: 782px ) {html {margin-top: 0 !important; padding-top: 46px !important}}</style><?php endif; ?>
</head>

<?php if ( is_front_page() ){
  $pageTypeClass = 'index';
} else {
  $pageTypeClass = 'lower';
}; ?>

<body <?php body_class($pageTypeClass); ?> id="pagetop" data-root-url='<?php echo esc_url( home_url() ); ?>/'>

<?php
// 本番環境かつWPにログインしていないユーザのみ、
// Google Tag Manager をトラッキングする。
if(SCF::get_option_meta( 'theme-options', 'gtm_noscript' )):
?>
<!-- BEGIN Google Tag Manager (noscript)-->
<?php
if ($production&&$guest) {
  echo SCF::get_option_meta( 'theme-options', 'gtm_noscript' );
  echo "\n";
} else {
?>
<!--
* Note: *
This is the same as tracking-code before renewal.（2019-01）
- Logged in user exclusion: Enable
-->
<?php
};
?>
<!-- END Google Tag Manager (noscript)-->
<?php endif; ?>

  <?php if (!$production):?>
  <div class="p-dev-notice" data-target='["devnotice"]'>
    <div class="p-dev-notice__inner">
      <div class="p-dev-notice__icon"><i class="glyph glyph-bullhorn"></i></div>
      <div class="p-dev-notice__body">
        <div class="p-dev-notice__title">Staging environment</div>
        <div class="p-dev-notice__lead">現在ステージング環境を閲覧中です。</div>
      </div>
      <div class="p-dev-notice__close is-active" data-trigger='["devnotice","fade"]'><i>✕</i></div>
    </div>
  </div>
  <?php endif; ?>


  <?php if ( is_front_page() ) : echo "\n";?>
  <div class="p-index-keyvisual">
    <div class="p-index-keyvisual__container c-container">
      <div class="p-index-keyvisual__item" data-inview>
        <?php
        if(get_field('kv_title')):
          echo delbr(get_field('kv_title'));
        endif;
        ?>
        <div class="p-index-keyvisual__detail">
          <p class="p-index-keyvisual__lead">
            <?php
            if(get_field('kv_lead')){
              the_field('kv_lead');echo "\n";
            }
            ?>
          </p>
          <a class="c-button--grad p-index-keyvisual__button" href="<?php echo($USER_APP_HOST); ?>/user/?mode=register" target="_blank">
            <i class="glyph glyph-id-badge"></i>
            無料でアカウント作成
          </a>
          <a class="c-button--primary p-index-keyvisual__button u-visible--ltXS" href="<?php echo($USER_APP_HOST); ?>/user/" target="_blank">
            <i class="glyph glyph-sign-in-alt"></i>
            ユーザーログイン
          </a>
        </div>
      </div>
    </div>
  </div>
  <?php endif; ?>

  <header class="l-header <?php if(!is_front_page()): ?>is-fixed<?php endif; ?>">
    <div class="l-header__body">
      <h1 class="c-logo l-header__logo">
        <a class="c-logo__body" href="<?php echo esc_url( home_url() ); ?>/">
          <span class="c-logo__symbol glyph glyph-brand-logo"></span>
          <span class="c-logo__text cft">Real-Connect</span>
        </a>
      </h1>
      <button class="c-nav-trigger c-nav-trigger--last-short c-nav-trigger--ltSM" data-mq-trigger='["nav","slide"]'>
        <span class="u-screen-reader-text">ナビゲーションを開閉する</span>
      </button>
      <div class="c-nav-target c-nav-target--ltSM" data-mq-target='["nav"]'>
        <nav class="l-navigation">
          <ul class="l-navigation__body u-flex--ce--gtSM">
            <li class="l-navigation__item u-visible--ltSM">
              <a class="l-navigation__link" href="<?php echo esc_url( home_url() ); ?>/">
                <i class="glyph glyph-home"></i>
                HOME
              </a>
            </li>
            <li class="l-navigation__item u-visible--ltSM">
              <a class="l-navigation__link" style="color: red; font-weight: bold;" href="<?php echo($APP_HOST); ?>/system_admin/place_application/create" target="_blank">店舗申請</a>
            </li>
            <li class="l-navigation__item u-visible--ltSM">
              <a class="l-navigation__link" style="color: red; font-weight: bold;" href="<?php echo($APP_HOST); ?>/system_admin/area_application/create" target="_blank">エリア申請</a>
            </li>
            <li class="l-navigation__item">
              <a class="l-navigation__link" href="<?php echo esc_url( home_url() ); ?>/privacy-policy/">個人情報保護方針</a>
            </li>
            <li class="l-navigation__item">
              <a class="l-navigation__link" href="<?php echo esc_url( home_url() ); ?>/terms-of-service/">サービス利用規約</a>
            </li>
            <li class="l-navigation__item">
              <a class="l-navigation__link" href="<?php echo esc_url( home_url() ); ?>/contact/">お問合せ</a>
            </li>
            <li class="l-navigation__item u-visible--gtMD">
              <a class="l-navigation__link" href="<?php echo($APP_HOST); ?>/system_admin/place_application/create" target="_blank">店舗申請</a>
            </li>
            <li class="l-navigation__item u-visible--gtMD">
              <a class="l-navigation__link" href="<?php echo($APP_HOST); ?>/system_admin/area_application/create" target="_blank">エリア申請</a>
            </li>
            <li class="l-navigation__item">
              <a class="l-navigation__link" href="<?php echo($APP_HOST); ?>/system_admin/bulletin_board?tab=event" target="_blank">掲示板</a>
            </li>
            <li class="l-navigation__item">
              <a class="c-button--primary l-navigation__button" href="<?php echo($USER_APP_HOST); ?>/user/" target="_blank"><i class="glyph glyph-sign-in-alt"></i>ログイン</a>
            </li>
            <li class="l-navigation__item">
              <a class="c-button--grad l-navigation__button" href="<?php echo($USER_APP_HOST); ?>/user/?mode=register" target="_blank"><i class="glyph glyph-id-badge"></i>新規登録</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
