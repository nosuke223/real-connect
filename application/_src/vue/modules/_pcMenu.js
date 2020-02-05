// ------------------------------
// 【PCのみ】
// ------------------------------
const pcMenu = $('.p-pc-menu')
const pcMenuBtn = $('.p-pc-menu__button')
const paneContainer = $('.l-pane-container')
const blockContainer = $('.l-block-container')
const headerUser = $('.p-header-app')
const headerTrig = $('.p-header-app__trigger')

module.exports.collapse = () => {

  // ------------------------------
  // サイドメニュー開閉
  // ------------------------------

  pcMenuBtn.on('click',function() {
    pcMenu.toggleClass('is-close')
    paneContainer.toggleClass('is-menu-close')
    blockContainer.toggleClass('is-menu-close')
  });

  // ------------------------------
  // ヘッダーのアカウント開閉
  // ------------------------------

  headerTrig.on('click',function() {
    headerUser.toggleClass('is-visible')
  });

  $('main').on('click',function() {
    headerUser.removeClass('is-visible')
  });

  $('.p-header-app__button[data-menu]').on('click',function() {
    headerTrig.trigger('click')
  });
}
