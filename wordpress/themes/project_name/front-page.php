<?php get_header(); ?>

<main class="l-main">

  <!-- BEGIN Page Content.-->

  <section class="p-index-about">
    <div class="c-heading--index" data-inview>
      <?php
      if(get_field('sec1_label')) {
        ?><span class="c-heading__label"><?php the_field('sec1_label'); ?></span><?php echo "\n";
      }
      ?>
      <?php
      if(get_field('sec1_title')) {
        ?><h2 class="c-heading__text"><?php the_field('sec1_title'); ?></h2><?php echo "\n";
      }
      ?>
    </div>
    <?php
    if(get_field('sec1_lead1')) {
      ?><p class="p-index-about__lead" data-inview><?php the_field('sec1_lead1'); ?></p><?php echo "\n";
    }
    ?>
    <?php
    if(get_field('sec1_lead2')) {
      ?><p class="p-index-about__lead" data-inview><?php the_field('sec1_lead2'); ?></p><?php echo "\n";
    }
    ?>
    <div class="p-index-about__detail c-container" data-inview>
      <?php
      if(get_field('sec1_thumb')) {
        ?><figure class="p-index-about__thumb"><img class="p-index-about__image" src="<?php the_field('sec1_thumb'); ?>" alt="りあこね開催会場イメージ"></figure><?php echo "\n";
      }
      ?>
      <?php
      if(get_field('sec1_text')) {
        ?><p class="p-index-about__text"><?php the_field('sec1_text'); ?></p><?php echo "\n";
      }
      ?>
    </div>

    <section class="p-index-point">
      <div class="c-heading--index" data-inview>
        <?php if(get_field('sec2_label')): ?>
        <span class="c-heading__label"><?php the_field('sec2_label'); ?></span>
        <?php endif; ?>
        <?php if(get_field('sec2_title')): ?>
        <h3 class="c-heading__text"><?php the_field('sec2_title'); ?></h3>
        <?php endif; ?>
      </div>

      <ul class="p-index-point__body c-container" data-inview>
        <li class="p-index-point__item" data-inview>
          <?php if(get_field('sec2_col1_icon')): ?>
          <figure class="p-index-point__icon">
            <img class="p-index-point__svg" src="<?php the_field('sec2_col1_icon'); ?>" alt="01">
          </figure>
          <?php endif; ?>
          <?php if(get_field('sec2_col1_title')): ?>
          <div class="p-index-point__title"><?php the_field('sec2_col1_title'); ?></div>
          <?php endif; ?>
          <?php if(get_field('sec2_col1_lead')): ?>
          <p class="p-index-point__lead"><?php the_field('sec2_col1_lead'); ?></p>
          <?php endif; ?>
        </li>

        <li class="p-index-point__item" data-inview>
          <?php if(get_field('sec2_col2_icon')): ?>
          <figure class="p-index-point__icon">
            <img class="p-index-point__svg" src="<?php the_field('sec2_col2_icon'); ?>" alt="02">
          </figure>
          <?php endif; ?>
          <?php if(get_field('sec2_col2_title')): ?>
          <div class="p-index-point__title"><?php the_field('sec2_col2_title'); ?></div>
          <?php endif; ?>
          <?php if(get_field('sec2_col2_lead')): ?>
          <p class="p-index-point__lead"><?php the_field('sec2_col2_lead'); ?></p>
          <?php endif; ?>
        </li>

        <li class="p-index-point__item" data-inview>
          <?php if(get_field('sec2_col3_icon')): ?>
          <figure class="p-index-point__icon">
            <img class="p-index-point__svg" src="<?php the_field('sec2_col3_icon'); ?>" alt="03">
          </figure>
          <?php endif; ?>
          <?php if(get_field('sec2_col3_title')): ?>
          <div class="p-index-point__title"><?php the_field('sec2_col3_title'); ?></div>
          <?php endif; ?>
          <?php if(get_field('sec2_col3_lead')): ?>
          <p class="p-index-point__lead"><?php the_field('sec2_col3_lead'); ?></p>
          <?php endif; ?>
        </li>

        <li class="p-index-point__item" data-inview>
          <?php if(get_field('sec2_col4_icon')): ?>
          <figure class="p-index-point__icon">
            <img class="p-index-point__svg" src="<?php the_field('sec2_col4_icon'); ?>" alt="04">
          </figure>
          <?php endif; ?>
          <?php if(get_field('sec2_col4_title')): ?>
          <div class="p-index-point__title"><?php the_field('sec2_col4_title'); ?></div>
          <?php endif; ?>
          <?php if(get_field('sec2_col4_lead')): ?>
          <p class="p-index-point__lead"><?php the_field('sec2_col4_lead'); ?></p>
          <?php endif; ?>
        </li>
      </ul>
    </section>
  </section>

  <section class="p-index-place-list">
    <div class="c-heading--index" data-inview>
      <?php if(get_field('sec3_label')): ?>
      <span class="c-heading__label"><?php the_field('sec3_label'); ?></span>
      <?php endif; ?>
      <?php if(get_field('sec3_title')): ?>
      <h3 class="c-heading__text"><?php the_field('sec3_title'); ?></h3>
      <?php endif; ?>
    </div>
    <?php if(get_field('sec3_lead')): ?>
      <p class="p-index-place-list__lead" data-inview><?php the_field('sec3_lead'); ?></p>
    <?php endif; ?>
    <ul class="p-index-place-list__body" data-inview>
      <?php
      if (is_user_logged_in()) {
        $args = array (
          'post_type' => place,
          'posts_per_page' => -1,
          'post_status' => array('publish','private'),
          'order'=> 'DESK'
        );
      } else {
        $args = array (
          'post_type' => place,
          'posts_per_page' => -1,
          'order'=> 'DESK'
        );
      };
      $myposts = get_posts( $args );
      foreach ( $myposts as $post ) : setup_postdata( $post );
      ?>
      <li class="p-index-place-list__item" data-modal-trigger="<?php echo get_the_ID(); ?>" data-inview>
        <figure class="p-index-place-list__logo">
          <?php if(get_field('place_logo')): ?>
          <img class="p-index-place-list__image" src="<?php the_field('place_logo'); ?>" alt="<?php the_title(); ?>">
          <?php else: ?>
          <img class="p-index-place-list__image" src="<?php echo get_stylesheet_directory_uri(); ?>/_assets/img/common/no-image-500.png" alt="<?php the_title(); ?>">
          <?php endif; ?>
        </figure>
        <p class="p-index-place-list__detail">
          <span class="p-index-place-list__area">
            <?php if(get_field('place_pref')): ?>
            <?php the_field('place_pref'); ?>
            <?php endif; ?>
            <?php if(get_field('place_area')): ?>
            <?php the_field('place_area'); ?>
            <?php endif; ?>
          </span>
          <span class="p-index-place-list__name"><?php the_title(); ?></span>
          <?php if(get_field('place_type')): ?>
          <span class="p-index-place-list__cat"><?php the_field('place_type'); ?></span>
          <?php endif; ?>
        </p>
      </li>
      <?php
      endforeach;
      wp_reset_postdata();
      ?>
    </ul>

    <?php
    if (is_user_logged_in()) {
      $args = array (
        'post_type' => place,
        'posts_per_page' => -1,
        'post_status' => array('publish','private'),
        'order'=> 'DESK'
      );
    } else {
      $args = array (
        'post_type' => place,
        'posts_per_page' => -1,
        'order'=> 'DESK'
      );
    };
    $myposts = get_posts( $args );
    foreach ( $myposts as $post ) : setup_postdata( $post );
    ?>
    <section class="c-modal p-placedetail" data-modal="<?php echo get_the_ID(); ?>">
      <div class="c-modal__overlay">
        <div class="c-modal__inner p-placedetail__body">
          <button class="p-placedetail__round-button" data-modal-close>×</button>
          <header class="p-placedetail__header">

            <figure class="p-placedetail__cover">
              <?php if(get_field('place_cover')): ?>
              <img class="p-placedetail__cover-image" src="<?php the_field('place_cover'); ?>" alt="<?php the_title(); ?>">
              <?php else: ?>
              <img class="p-placedetail__cover-image" src="<?php echo get_stylesheet_directory_uri(); ?>/_assets/img/common/no-image-1200x800.png" alt="<?php the_title(); ?>">
              <?php endif; ?>
            </figure>

            <div class="p-placedetail__title">
              <figure class="p-placedetail__logo">
                <?php if(get_field('place_logo')): ?>
                <img class="p-placedetail__logo-image" src="<?php the_field('place_logo'); ?>" alt="<?php the_title(); ?>">
                <?php else: ?>
                <img class="p-placedetail__logo-image" src="<?php echo get_stylesheet_directory_uri(); ?>/_assets/img/common/no-image-500.png" alt="<?php the_title(); ?>">
                <?php endif; ?>
              </figure>
              <h3 class="p-placedetail__name">
                <span><?php the_title(); ?></span>
                <?php if(get_field('place_type')): ?>
                <small><?php the_field('place_type'); ?></small>
                <?php endif; ?>
              </h3>
            </div>
          </header>
          <?php if(get_field('place_intro')): ?>
          <div class="p-placedetail__about">
            <div class="p-placedetail__about-label">About</div>
            <div class="p-placedetail__about-lead"><?php the_field('place_intro'); ?></div>
          </div>
          <?php endif; ?>
          <table class="p-placedetail__table">
            <tbody>
              <tr>
                <th>住所</th>
                <td>
                  <?php if(get_field('place_pref')): ?>
                  <?php the_field('place_pref'); ?>
                  <?php endif; ?>
                  <?php if(get_field('place_area')): ?>
                  <?php the_field('place_area'); ?>
                  <?php endif; ?>
                  <br>
                  <?php if(get_field('place_address')): ?>
                  <a href="<?php
                  $url1 = "https://www.google.co.jp/maps/search/";
                  $adrs = get_field('place_address');
                  $name = $post->post_title;
                  echo esc_url($url1.$adrs.' '.$name);
                  ?>">
                    <i class="glyph glyph-map-marked-alt"></i>
                    <?php the_field('place_address'); ?>
                  </a>
                  <?php endif; ?>
                </td>
              </tr>
              <tr>
                <th>営業時間</th>
                <td>
                  <ul>
                    <li>
                      <b>日</b>
                      <?php if(get_field('place_close_sun')): ?>
                      定休日
                      <?php else: ?>
                      <?php the_field('place_begin_sun'); ?>
                      -
                      <?php the_field('place_end_sun'); ?>
                      <?php endif; ?>
                    </li>
                    <li>
                      <b>月</b>
                      <?php if(get_field('place_close_mon')): ?>
                      定休日
                      <?php else: ?>
                      <?php the_field('place_begin_mon'); ?>
                      -
                      <?php the_field('place_end_mon'); ?>
                      <?php endif; ?>
                    </li>
                    <li>
                      <b>火</b>
                      <?php if(get_field('place_close_tue')): ?>
                      定休日
                      <?php else: ?>
                      <?php the_field('place_begin_tue'); ?>
                      -
                      <?php the_field('place_end_tue'); ?>
                      <?php endif; ?>
                    </li>
                    <li>
                      <b>水</b>
                      <?php if(get_field('place_close_wed')): ?>
                      定休日
                      <?php else: ?>
                      <?php the_field('place_begin_wed'); ?>
                      -
                      <?php the_field('place_end_wed'); ?>
                      <?php endif; ?>
                    </li>
                    <li>
                      <b>木</b>
                      <?php if(get_field('place_close_thu')): ?>
                      定休日
                      <?php else: ?>
                      <?php the_field('place_begin_thu'); ?>
                      -
                      <?php the_field('place_end_thu'); ?>
                      <?php endif; ?>
                    </li>
                    <li>
                      <b>金</b>
                      <?php if(get_field('place_close_fri')): ?>
                      定休日
                      <?php else: ?>
                      <?php the_field('place_begin_fri'); ?>
                      -
                      <?php the_field('place_end_fri'); ?>
                      <?php endif; ?>
                    </li>
                    <li>
                      <b>土</b>
                      <?php if(get_field('place_close_sat')): ?>
                      定休日
                      <?php else: ?>
                      <?php the_field('place_begin_sat'); ?>
                      -
                      <?php the_field('place_end_sat'); ?>
                      <?php endif; ?>
                    </li>
                  </ul>
                  <small>※ 営業時間・休業日は予告なく変更となる場合があります。</small>
                </td>
              </tr>
              <tr>
                <th>電話番号</th>
                <td>
                  <?php if(get_field('place_tel')): ?>
                  <a href="tel:<?php the_field('place_tel'); ?>">
                    <i class="scale">☎</i>
                    <?php the_field('place_tel'); ?>
                  </a>
                  <?php else: ?>
                  -
                  <?php endif; ?>
                </td>
              </tr>
              <tr>
                <th>公式サイト</th>
                <td>
                  <?php if(get_field('place_url')): ?>
                    <a href="<?php the_field('place_url'); ?>">
                      <?php the_field('place_url'); ?>
                    </a>
                  <?php else: ?>
                  -
                  <?php endif; ?>
                </td>
              </tr>
              <tr>
                <th>備考</th>
                <td>
                  <?php if(get_field('place_remark')): ?>
                  <?php the_field('place_remark'); ?>
                  <?php else: ?>
                  -
                  <?php endif; ?>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="p-placedetail__close" data-modal-close>Close</button>
        </div>
      </div>
    </section>
    <?php
    echo "\n";
    endforeach;
    wp_reset_postdata();
    ?>
  </section>

  <section class="p-index-usage">
    <div class="c-heading--index" data-inview>
      <?php if(get_field('sec4_label')): ?>
      <span class="c-heading__label"><?php the_field('sec4_label'); ?></span>
      <?php endif; ?>
      <?php if(get_field('sec4_title')): ?>
      <h3 class="c-heading__text"><?php the_field('sec4_title'); ?></h3>
      <?php endif; ?>
    </div>
    <?php if(get_field('sec4_lead')): ?>
      <p class="p-index-usage__intro" data-inview><?php the_field('sec4_lead'); ?></p>
    <?php endif; ?>
    <ul class="p-index-usage__body">

      <li class="p-index-usage__item" data-inview>
        <?php if(get_field('sec4_col1_icon')): ?>
          <figure class="p-index-usage__icon">
            <img class="p-index-usage__svg" src="<?php the_field('sec4_col1_icon'); ?>" alt="01">
          </figure>
        <?php endif; ?>
        <?php if(get_field('sec4_col1_thumb')): ?>
        <figure class="p-index-usage__thumb">
          <img class="p-index-usage__image" src="<?php the_field('sec4_col1_thumb'); ?>" alt="<?php the_field('sec4_col1_title'); ?>">
        </figure>
        <?php endif; ?>
        <dl class="p-index-usage__detail">
          <?php if(get_field('sec4_col1_title')): ?>
          <dt class="p-index-usage__title"><?php the_field('sec4_col1_title'); ?></dt>
          <?php endif; ?>
          <?php if(get_field('sec4_col1_lead')): ?>
          <dd class="p-index-usage__lead"><?php the_field('sec4_col1_lead'); ?></dd>
          <?php endif; ?>
        </dl>
      </li>

      <li class="p-index-usage__item" data-inview>
        <?php if(get_field('sec4_col2_icon')): ?>
          <figure class="p-index-usage__icon">
            <img class="p-index-usage__svg" src="<?php the_field('sec4_col2_icon'); ?>" alt="02">
          </figure>
        <?php endif; ?>
        <?php if(get_field('sec4_col2_thumb')): ?>
        <figure class="p-index-usage__thumb">
          <img class="p-index-usage__image" src="<?php the_field('sec4_col2_thumb'); ?>" alt="<?php the_field('sec4_col2_title'); ?>">
        </figure>
        <?php endif; ?>
        <dl class="p-index-usage__detail">
          <?php if(get_field('sec4_col2_title')): ?>
          <dt class="p-index-usage__title"><?php the_field('sec4_col2_title'); ?></dt>
          <?php endif; ?>
          <?php if(get_field('sec4_col2_lead')): ?>
          <dd class="p-index-usage__lead"><?php the_field('sec4_col2_lead'); ?></dd>
          <?php endif; ?>
        </dl>
      </li>

      <li class="p-index-usage__item" data-inview>
        <?php if(get_field('sec4_col3_icon')): ?>
          <figure class="p-index-usage__icon">
            <img class="p-index-usage__svg" src="<?php the_field('sec4_col3_icon'); ?>" alt="03">
          </figure>
        <?php endif; ?>
        <?php if(get_field('sec4_col3_thumb')): ?>
        <figure class="p-index-usage__thumb">
          <img class="p-index-usage__image" src="<?php the_field('sec4_col3_thumb'); ?>" alt="<?php the_field('sec4_col3_title'); ?>">
        </figure>
        <?php endif; ?>
        <dl class="p-index-usage__detail">
          <?php if(get_field('sec4_col3_title')): ?>
          <dt class="p-index-usage__title"><?php the_field('sec4_col3_title'); ?></dt>
          <?php endif; ?>
          <?php if(get_field('sec4_col3_lead')): ?>
          <dd class="p-index-usage__lead"><?php the_field('sec4_col3_lead'); ?></dd>
          <?php endif; ?>
        </dl>
      </li>

      <li class="p-index-usage__item" data-inview>
        <?php if(get_field('sec4_col4_icon')): ?>
          <figure class="p-index-usage__icon">
            <img class="p-index-usage__svg" src="<?php the_field('sec4_col4_icon'); ?>" alt="04">
          </figure>
        <?php endif; ?>
        <?php if(get_field('sec4_col4_thumb')): ?>
        <figure class="p-index-usage__thumb">
          <img class="p-index-usage__image" src="<?php the_field('sec4_col4_thumb'); ?>" alt="<?php the_field('sec4_col4_title'); ?>">
        </figure>
        <?php endif; ?>
        <dl class="p-index-usage__detail">
          <?php if(get_field('sec4_col4_title')): ?>
          <dt class="p-index-usage__title"><?php the_field('sec4_col4_title'); ?></dt>
          <?php endif; ?>
          <?php if(get_field('sec4_col4_lead')): ?>
          <dd class="p-index-usage__lead"><?php the_field('sec4_col4_lead'); ?></dd>
          <?php endif; ?>
        </dl>
      </li>
    </ul>
  </section>

  <section class="p-fluid">
    <div class="p-fluid__inner">
      <div class="c-heading--index" data-inview>
        <span class="c-heading__label">For Owners</span>
        <h2 class="c-heading__text">加盟店・イベント開催会場の募集</h2>
      </div>
      <p class="p-fluid__lead" data-inview>
        「りあこね」の開催場所となる会場を募集中です。<br>
        <br>
        レストランやカフェ、バーなどの飲食店舗や、セミナー、交流会、親睦会などのイベント会場での<br class="u-hidden--ltXXS">
        「りあこね」活用によるコミュニケーションの活性化と集客をお考えの方は、<br class="u-hidden--ltXXS">
        継続イベント・特設イベントなど、実施形態をご相談ください。
      </p>
      <a class="c-button p-fluid__button" href="<?php echo esc_url( home_url() ); ?>/contact/" data-inview>
        <i class="glyph glyph-envelope"></i>
        お問合せはこちら
      </a>
    </div>
  </section>

  <!-- END Page Content.-->

  <a class="c-pagetop-button" href="#pagetop">
    <span class="u-screen-reader-text">ページ上部へ移動</span>
  </a>

</main>

<?php get_footer(); ?>
