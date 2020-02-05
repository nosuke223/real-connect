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
        <span itemprop="name"><?php the_title(); ?></span>
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
        <?php if(get_field('cv_en_title')): ?>
          <small class="c-editor-header__en-title"><?php the_field('cv_en_title'); ?></small>
        <?php endif; ?>
        <h2 class="c-editor-header__title"><?php the_title(); ?></h2>
      </header>

      <?php
      if (have_posts()) :
      while (have_posts()) :
      the_post();
      ?>
      <div class="c-editor-content">
        <?php the_content(); ?>
      </div>

      <?php if ( is_page('sitemaps') ) : ?>
        <?php get_template_part( 'inc/sitemaps' ); ?>
      <?php endif; ?>

      <?php
      endwhile;
      endif;
      ?>

    </article>

    <?php get_sidebar(); ?>

  </div>

  <!-- END Page Content.-->

  <a class="c-pagetop-button" href="#pagetop">
    <span class="u-screen-reader-text">ページ上部へ移動</span>
  </a>

</main>

<?php get_footer(); ?>
