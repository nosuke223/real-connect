// ------------------------------
// 【ブロックのアクティベート】
// アニメーションの処理は JS ではなく CSS。
// JS 側ではクラスの付け替えのみ。
// ------------------------------

const blockBehind = $('.l-block-behind');

module.exports.block = () => {
  // ------------------------------
  // ブロック表示用のカスタムデータ属性のクリック
  // ------------------------------
  $(document).on('click', '[data-block]', function () {
    let targetVal = $(this).data('block');

    if ( targetVal == 'back' ) {
      // ------------------------------
      // ブロックの操作を一つ戻るための
      // ------------------------------
      let thisID = $(this).closest('.l-block').attr('id');
      let trigger_ = '[data-block="' + thisID + '"]'
      $(trigger_).trigger('click');
    } else {
      let targetElm = '#' + targetVal;
      let targetLayer = $(targetElm).data('layer');

      $(targetElm)
      .toggleClass('is-visible')

      if (targetLayer==2) {
        $('[data-layer="1"].l-block.is-visible')
        .toggleClass('is-behind')
      }

      if (targetLayer==3) {
        $('[data-layer="1"].l-block.is-visible')
        .toggleClass('is-behind')

        $('[data-layer="2"].l-block.is-visible')
        .toggleClass('is-behind')
      }

      if ($('.l-block.is-visible').length) {
        blockBehind
        .addClass('is-behind')
      } else {
        blockBehind
        .removeClass('is-behind')
      }
    }
  });
}
