// ------------------------------
// 【ペインのアクティベート】
// アニメーションの処理は JS ではなく CSS。
// JS 側ではクラスの付け替えのみ。
// ------------------------------

const pane = $('.l-pane')
let targetElm, pushedNum, pushedElm

module.exports.pane = () => {

  // --------------------
  // 通常のトグル機能
  // --------------------

  $(document).on('click', '[data-pane]', (e) => {
    let targetVal = Number($(e.currentTarget).data('pane'))
    if (targetVal) {
      targetElm = '#pane' + targetVal
      pushedNum = targetVal + 1
      pushedElm = '#pane' + pushedNum
      pane.removeClass('is-visible')
      $(pushedElm).addClass('is-pushed')
      $(targetElm).addClass('is-visible').removeClass('is-pushed')
    }
  })
}
