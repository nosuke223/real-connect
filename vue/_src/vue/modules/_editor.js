// ------------------------------
// Wysiwyg エディターの設定
// ------------------------------
window.$ = window.umbrella = require('umbrellajs')
window.Quill = require('quill')

module.exports.editor = () => {
  const toolbarOptions = [
    ['bold', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'header': [3, 4, false] }],
    [{ 'align': [] }],
    // ['clean'],
  ];

  const options = {
    modules: {
      toolbar: toolbarOptions,
    },
    theme: 'snow',
  };

  function mountEditor(target) {
    if ($(target).length) {
      new Quill(target, options);
    }
  }

  function setEditor(target) {
    if (target instanceof Array) {
      target.forEach((item, index) => mountEditor(target[index]))
    } else {
      mountEditor(target)
    }
  }

  setEditor([
    '#e-license',
    '#e-terms',
    '#e-privacy',
  ])
}
