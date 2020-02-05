// ------------------------------
// 簡単なトースト表示
// ------------------------------

const trig = '[data-toast]'

module.exports.toast = () => {

  $(document).on('click', trig, function () {
    let ttl = $(this).data('toast')[0];
    if (ttl) {
      let txt = $(this).data('toast')[1];
      let block = ''
      block +=  '<article class="c-toast">'
      block +=    '<div class="c-toast__frame">'
      block +=      '<div class="c-toast__inner u-text">'
      block +=        '<h2><i class="glyph glyph-exclamation-circle"></i>'
      block +=        ttl + '</h2>'
      if (txt) {
        block +=        '<p>' + txt + '</p>'
      }
      block +=      '</div>'
      block +=    '</div>'
      block +=  '</article>'
      $('body').append(block)
      setTimeout(function () {
        $('.c-toast').stop().fadeOut(1000)
      }, 2000)
    }
  })

}
