<?php if ( is_home() || is_front_page() ) : ?>
<meta name="twitter:card" content="summary_large_image">
<?php elseif ( is_page('slug') ) : ?>
<meta name="twitter:card" content="summary_large_image">
<?php elseif ( is_page()) : ?>
<meta name="twitter:card" content="summary">
<?php elseif ( is_singular('post_type')) : ?>
<meta name="twitter:card" content="summary">
<?php elseif ( is_single()) : ?>
<meta name="twitter:card" content="summary">
<?php elseif ( is_archive()) : ?>
<meta name="twitter:card" content="summary">
<?php elseif ( is_post_type_archive('post_type')) : ?>
<meta name="twitter:card" content="summary">
<?php elseif ( is_post_type_archive()) : ?>
<meta name="twitter:card" content="summary">
<?php else: ?>
<meta name="twitter:card" content="summary_large_image">
<?php endif; ?>
<?php if(SCF::get_option_meta( 'theme-options', 'twitter_ac' )): ?>
<meta name="twitter:site" content="<?php echo SCF::get_option_meta( 'theme-options', 'twitter_ac' ); ?>">
<?php endif; ?>
<?php if( is_single() ) { ?>
<meta property="og:type" content="article">
<?php } else { ?>
<meta property="og:type" content="website">
<?php } ?>
<meta property="og:url" content="<?php echo ( "https://" . $_SERVER[ "HTTP_HOST" ] . $_SERVER[ "REQUEST_URI" ] ); ?>">
<meta property="og:title" content="<?php wp_title( '|', true, 'right' ); ?><?php bloginfo( 'name' ); ?>">
<?php if( ( is_single() || is_page() ) && has_post_thumbnail() ) { ?>
<meta property="og:image" content="<?php the_post_thumbnail_url( 'full' ); ?>">
<?php } else if(is_page()) { ?>
<meta property="og:image" content="<?php echo esc_url( get_template_directory_uri() ); ?>/_assets/img/common/og-image-small.png">
<?php } else { ?>
<meta property="og:image" content="<?php echo esc_url( get_template_directory_uri() ); ?>/_assets/img/common/og-image.png">
<?php } ?>
<?php if( is_single() ) { ?>
<meta property="og:description" content="<?php echo mb_substr( str_replace( array( "\r\n" , "\n" , "\r" ), '', strip_tags( $post->post_content ) ), 0, 100 ); ?>">
<?php } else { ?>
<?php if(get_field('cv_description')): ?>
<meta property="og:description" content="<?php the_field('cv_description'); ?>">
<?php elseif(SCF::get_option_meta( 'theme-options', 'description' )): ?>
<meta property="og:description" content="<?php echo SCF::get_option_meta( 'theme-options', 'description' ); ?>">
<?php endif; ?>
<?php } ?>
<meta property="og:locale" content="ja_JP">
<?php if( is_single() ) { ?>
<?php if(SCF::get_option_meta( 'theme-options', 'article:publisher' )): ?>
<meta property="article:publisher" content="<?php echo SCF::get_option_meta( 'theme-options', 'article:publisher' ); ?>">
<?php endif; ?>
<?php } ?>
<?php if(SCF::get_option_meta( 'theme-options', 'facebook_user_name' )): ?>
<meta property="fb:admins" content="<?php echo SCF::get_option_meta( 'theme-options', 'facebook_user_name' ); ?>">
<?php endif; ?>
<?php if(SCF::get_option_meta( 'theme-options', 'fbappid' )): ?>
<meta property="fb:app_id" content="<?php echo SCF::get_option_meta( 'theme-options', 'fbappid' ); ?>">
<?php endif; ?>
