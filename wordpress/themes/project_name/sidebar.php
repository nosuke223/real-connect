<div class="l-sidebar u-hidden--ltXS">
<?php
if ($_SERVER[ "HTTP_HOST" ] == 'real-connect.jp') {
  $production = true;
} else {
  $production = false;
};
$USER_APP_HOST = $production ? "https://real-connect.jp" : "https://rc1.onssl.jp";
?>
  <nav class="p-page-list">
    <h2 class="p-page-list__title">
      <a class="p-page-list__label" href="<?php echo esc_url( home_url() ); ?>">
        <i class="glyph glyph-home"></i>
        りあこね HOME
      </a>
    </h2>
    <h2 class="p-page-list__title">
      <span class="p-page-list__label">
        <i class="glyph glyph-secure"></i>
        サービスのご利用にあたって
      </span>
    </h2>
    <ul class="p-page-list__body p-page-list__body--child">
      <li class="p-page-list__item">
        <a class="p-page-list__content" href="<?php echo esc_url( home_url() ); ?>/privacy-policy/">
          個人情報保護方針
        </a>
      </li>
      <li class="p-page-list__item">
        <a class="p-page-list__content" href="<?php echo esc_url( home_url() ); ?>/terms-of-service/">
          サービス利用規約
        </a>
      </li>
      <li class="p-page-list__item">
        <a class="p-page-list__content" href="<?php echo esc_url( home_url() ); ?>/contact/">
          お問い合わせ
        </a>
      </li>
    </ul>
    <div class="p-page-list__button-container">
      <a class="c-button--primary p-page-list__button" href="<?php echo($USER_APP_HOST); ?>/user/" target="_blank">
        <i class="glyph glyph-sign-in-alt"></i>
        ログイン
      </a>
      <a class="c-button--grad p-page-list__button" href="<?php echo($USER_APP_HOST); ?>/user/?mode=register" target="_blank">
        <i class="glyph glyph-id-badge"></i>
        新規登録
      </a>
    </div>
  </nav>
</div>
