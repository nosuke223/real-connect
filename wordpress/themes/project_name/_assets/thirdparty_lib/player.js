const videoId = "XXXXXXXX";
const videoPlayDivId = "player";
let myport
if (location.port.length>0) {
  myport = ':' + location.port
}
const MY_ORIGIN = location.protocol + '//' + location.hostname + myport + '/'

// IFrame APIの読み込み
const scriptElm = document.createElement("script");
scriptElm.src = "https://www.youtube.com/iframe_api";
const headElm = document.querySelector("head");
headElm.appendChild(scriptElm);

// iframeで埋め込まれるプレイヤーの設定
function onYouTubeIframeAPIReady() {
  console.log(MY_ORIGIN);
  const player = new YT.Player(videoPlayDivId, {
    videoId: videoId,
    playerlets : {
      playlist : videoId,
      autoplay: 1,
      rel: 0,
      origin: MY_ORIGIN,
    },
    playerVars: {
      playsinline: 1,
      // mute: 1,
      vq: 'hd1080',
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      cc_load_policy: 0,
      // enablejsapi: 1,
      wmode: 'transparent',
      origin: MY_ORIGIN,
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// プレイヤーの準備完了時に実行される関数
function onPlayerReady(event) {
  const player = event.target
  player.mute(); // 消音しないと自動再生されない
  player.playVideo();
}

function onPlayerStateChange(event) {
  const player = event.target
  player.mute(); // 消音しないと自動再生されない
  player.playVideo();
}
