// ------------------------------
// フリック・スワイプ操作のイベントを取得
// ------------------------------

const container = $('.p-pane-target-container');
const pane = $('.l-pane');
let directionX, moveX, moveY, moveRate, moveValX, directMoveX

module.exports.flick = () => {
  container.on({

    // ------------------------------
    // フリック開始時
    // ------------------------------
    'touchstart': function(e) {
      this.touchX = event.changedTouches[0].pageX;
      this.slideX = $(this).position().left;
      this.touchY = event.changedTouches[0].pageY;
      moveValX = parseInt( $(this).css('left') );
    },

    // ------------------------------
    // フリック中
    // ------------------------------
    'touchmove': function(e) {
      moveX = this.touchX - event.changedTouches[0].pageX
      moveY = this.touchY - event.changedTouches[0].pageY
      moveRate = Math.abs( moveX / moveY )

      // フリックする方向が左か右か判別するためのフラグを指定
      // ------------------------------
      if ( moveX > 0 ) {
        directionX = 'left'
      } else {
        directionX = 'right'
      }

      // 横：縦の移動比率が 1 以上の場合に
      // 移動距離のぶんコンテナをずらす
      // ------------------------------
      if ( moveRate > 1 ) {
        directMoveX = moveValX - moveX
        $(this).css({
          'left': directMoveX
        });
      }
    },

    // ------------------------------
    // フリック終了
    // ------------------------------
    'touchend': function(e) {
      let currentTab = $(this).closest(pane).find('.p-pane-tab__item.is-active')
      moveValX = parseInt( $(this).css('left') );

      // 横：縦の移動比率が 1 以上の場合に
      // タブにクリックのトリガーを指定
      // ------------------------------
      if ( moveRate > 1 ) {

        // 左にフリックした場合
        if ( directionX == 'left' ) {
          let targetTab = $(currentTab).next('.p-pane-tab__item')
          if ( targetTab.length ) {
            targetTab.trigger('click')
            // console.log('次のタブがある');
          } else {
            currentTab.trigger('click')
          }
        }

        // 右にフリックした場合
        if ( directionX == 'right' ) {
          let targetTab = $(currentTab).prev('.p-pane-tab__item')
          if ( targetTab.length ) {
            targetTab.trigger('click')
          } else {
            currentTab.trigger('click')
          }
        }

      }
    }

  });
}
