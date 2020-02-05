// ------------------------------
// 閲覧がブラウザーかスタンドアローン版かを判定しクラス付替
// ※ iOS と Android で分ける
// ------------------------------

const userAgent = navigator.userAgent.toLowerCase();
let sc = screen.height
let cl = document.documentElement.clientHeight;

module.exports.standalone = () => {

  // [iOS] ブラウザーかスタンドアローン版かを判定しクラス付替
  // ------------------------------
  if (userAgent.indexOf('iphone') > 0 || userAgent.indexOf('ipod') > 0 || userAgent.indexOf('iPad') > 0) {
    if(navigator.standalone) {
      $('body').addClass('ios-standalone');
    } else {
      $('body').addClass('ios-not-standalone');
    }
  }

  // [Android] ブラウザーかスタンドアローン版かを判定しクラス付替
  if ( (userAgent.indexOf('android') > 0) ) {
    if ( sc > cl + 30 ) {
      $('body').addClass('android-not-standalone');
    } else {
      $('body').addClass('android-standalone');
    }
  }
  if ( (userAgent.indexOf('android') > 0) && ( sc > cl + 30 )) {
    $('body').addClass('android-not-standalone');
  }


}
