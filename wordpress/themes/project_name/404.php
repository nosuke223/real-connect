<?php get_header(); ?>

<nav class="c-breadcrumb-container" aria-label="Breadcrumb">
  <ol class="c-breadcrumb" itemscope="itemscope" itemtype="http://schema.org/BreadcrumbList">
    <li class="c-breadcrumb__item" itemprop="itemListElement" itemscope="itemscope" itemtype="http://schema.org/ListItem">
      <a class="c-breadcrumb__link" href="<?php echo esc_url( home_url() ); ?>/" itemprop="item">
        <i class="glyph glyph-home" itemprop="name"></i>
        <span class="u-screen-reader-text">Home</span>
      </a>
      <meta itemprop="position" content="1" />
    </li>
    <li class="c-breadcrumb__item" itemprop="itemListElement" itemscope="itemscope" itemtype="http://schema.org/ListItem">
      <a class="c-breadcrumb__link" href="<?php echo $url; ?>" itemprop="item" aria-current="page">
        <span itemprop="name">ページが見つかりません。</span>
      </a>
      <meta itemprop="position" content="3" />
    </li>
  </ol>
</nav>

<main class="l-main">
  <!-- BEGIN Page Content.-->
  <div class="c-container-wrap">
    <article class="c-container c-content">
      <header class="c-editor-header">
        <small class="c-editor-header__en-title">404 Page Not Found.</small>
        <h2 class="c-editor-header__title">ページが見つかりません。</h2>
      </header>
      <div class="c-editor-content">
        <p>
          検索中のページは一時的にアクセスができない状況にあるか、<br>
          削除された、名称が変更された、または現在利用できない可能性があります。
        </p>
        <h3>次のことを試してください。</h3>
        <ul>
          <li>アドレス バーにページアドレスを入力した場合は、ページアドレスを正しく入力したかどうかを確認してください。</li>
          <li>ホームページを開いてから、表示する情報へのリンクを探してください。</li>
          <li>別のリンク先を表示するには、 <a href="<?php echo esc_url( home_url() ); ?>/">ホーム</a> へ戻り、再度お試しください。</li>
        </ul>
      </div>
    </article>

    <?php get_sidebar(); ?>

  </div>

  <!-- END Page Content.-->

  <a class="c-pagetop-button" href="#pagetop">
    <span class="u-screen-reader-text">ページ上部へ移動</span>
  </a>

</main>

<?php get_footer(); ?>
