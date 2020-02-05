// ------------------------------
// 画像の選択と設定
// ------------------------------

const inItem = $('.is-item-in')

module.exports.cover = () => {
  // ------------------------------
  // カバー画像設定
  // ------------------------------

  inItem.on('click',function() {
    inItem.removeClass('is-selected')
    $(this).addClass('is-selected')
  });
}
