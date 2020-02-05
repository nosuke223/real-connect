// ------------------------------
// 【PCでのメニューのアクティベート】
// アニメーションの処理は JS ではなく CSS。
// JS 側ではクラスの付け替えのみ。
// ------------------------------

const menu = $('[data-menu]');
const block = $('.l-block');

module.exports.menu = () => {
  // ------------------------------
  // ブロック表示用のカスタムデータ属性のクリック
  // ------------------------------
  $('[data-menu="back"]').addClass('is-active');

  menu.on('click',function() {
    let self = $(this)
    let val = self.data('menu')
    let elm = $('#' + val)

    block.removeClass('is-visible')
    menu.removeClass('is-active')
    self.addClass('is-active')

    if ( val != 'back') {
      elm.addClass('is-visible')
    }

    menu.filter(function() {
      return $(this).data('menu') == val;
    }).addClass('is-active')
  });

  $('.l-block.is-visible').each(function(){
    let node = this
    let nodeId = $(node).attr('id')
    let targetItem = $('[data-menu="'+nodeId+'"]')
    targetItem.addClass('is-active')
    $('[data-menu="back"]').removeClass('is-active')
  });
}
