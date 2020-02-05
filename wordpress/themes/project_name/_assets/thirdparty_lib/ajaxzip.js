// ------------------------------
// 郵便番号3桁+4桁の入力欄で3つの住所欄に出力する
// ------------------------------

jQuery(function($){
  $("#zip").attr('onKeyUp', 'AjaxZip3.zip2addr(this,"","address","address");');
  $("#zip2").attr('onKeyUp', 'AjaxZip3.zip2addr("zip1","zip2","prefecture","city","street");');
});
