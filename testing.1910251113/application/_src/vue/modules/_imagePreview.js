// ------------------------------
// 簡単な画像プレビューの設定
// ------------------------------

const imgPrev = $('.p-image-preview')
const frame = $('.p-image-preview__frame')
const prevImg = $('.p-image-preview__frame img')
const backBtn = $('.p-image-preview__back')

module.exports.imagePreview = () => {
  $(document).on('click', '[data-imgpre]', (e) => {
    let node = e.target
    let imgSrc = $(node).attr('src')
    prevImg.attr({'src':imgSrc});
    imgPrev.addClass('is-visible')
  })
  frame.on('click',function() {
    imgPrev.removeClass('is-visible')
    frame.removeClass('is-scaled')
  });
  prevImg.on('click',function() {
    frame.toggleClass('is-scaled')
    event.stopPropagation();
  });
  backBtn.on('click',function() {
    imgPrev.removeClass('is-visible')
    frame.removeClass('is-scaled')
  });

}
