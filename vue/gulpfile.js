const
  SRC = './_src', // <= ソースファイル（監視ディレクトリ）
  DST = './dest', // <= テーマやパッケージ名、PJ名など。(デフォルト : dest)
  DST_ASSETS = DST+'/_assets'

const
  // [NPM 非依存 公式] Node.jsでファイルを操作
  fs = require('fs'),
  // [NPM 非依存] 本体（タスクランナー）
  { src, dest, series, parallel, watch } = require('gulp'),
  // [Gulp] 変数を他のコンパイラにわたす
  data = require('gulp-data'),
  // [Gulp] Pug（テンプレートエンジン）
  pug = require('gulp-pug'),
  // [Gulp] Sass
  sass = require('gulp-sass'),
  // [Gulp] Sass のワイルドカードインポート
  sassGlob = require('gulp-sass-glob'),
  // [Gulp] ベンダープレフィックス付与
  autoprefixer = require('gulp-autoprefixer'),
  // [Gulp] デスクトップ通知を出す
  notify = require('gulp-notify'),
  // [Gulp] エラー解消時にタスクを再開
  plumber = require('gulp-plumber'),
  // [NPM 非依存 公式] ファイルのローカルパスを扱う
  path = require('path'),
  // [Gulp] 画像圧縮
  imagemin = require('gulp-imagemin'),
  // [Gulp Imagemin] Mozilla製で高画質のJPEGエンコーダー
  mozjpeg = require('imagemin-mozjpeg'),
  // [Gulp] 変更があったファイル・ディレクトリのみに処理させる
  changed = require('gulp-changed'),
  // [NPM 非依存] 同期リロードをさせる
  browser = require('browser-sync'),
  // [NPM 非依存] requireをフロントエンドで利用するための変換を行う
  browserify = require('browserify'),
  // [NPM 非依存] ES6のトランスパイラ
  babelify   = require('babelify'),
  // [NPM 非依存] オブジェクトをvinylオブジェクトに変換する
  source = require('vinyl-source-stream')

// ========================================
// 変換処理
// ========================================

// ----------------------------------------
// Pug（コンパイル）
// ----------------------------------------

const pug_html = () => {
  let locals
  try {
    locals = {
      'site': JSON.parse(fs.readFileSync('conf.json'))
    }
  } catch (e) {
    console.log(e)
    notify.onError(e)
  }
  return src([
    SRC+'/pug/**/*.pug',
    '!'+SRC+'/pug/**/_*.pug'
  ])
    .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
    .pipe(data(function(file) {
      locals.relativePath = path.relative(
        file.base,
        file.path.replace(/.pug$/,'.html')
      )
      locals.currentDir = path.relative(
        file.base,
        file.path.replace(/index.pug$/,'')
      )
      // If lower page
      if ( locals.currentDir.length > 1 ) {
        locals.currentDir += "/";
      }
      let namedPug = 0;
      let dirCount = 0;
      locals.depth = ""
      if ( locals.currentDir.length ) {
        if ( locals.currentDir.match('.pug') ) {namedPug = 1}
        dirCount = locals.currentDir.match(/\//gm).length - namedPug;
        for (var i = 0; i < dirCount; i++) {locals.depth += '../'}
      }
      return locals
    }))
    .pipe(changed(DST))
    .pipe(pug({
      locals: locals,
      basedir: SRC+'/pug/',
      pretty: '  ', // <= HTMLを圧縮しない場合、コメントはずす
    }))
    .pipe(dest(DST))
}

// ----------------------------------------
// CSS（コンパイル）
// ----------------------------------------

const css = () => {
  return src(SRC+'/scss/*.scss', { sourcemaps: true })
    .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
    .pipe(sassGlob())
    .pipe(sass({
      // outputStyle: ['compressed'|'compact'|'expanded'|'nested']
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer())
    .pipe(dest(DST_ASSETS+'/css', { sourcemaps: './__maps' }))
    .pipe(browser.stream())
}

// ----------------------------------------
// JS
// ----------------------------------------

const js = (target) => {
  return browserify({'entries': [SRC+'/vue/'+target+'.js']},{debug:false})
    .transform(babelify)
    .require('vue/dist/vue.common.js',{expose: 'vue'})
    .bundle()
    .on('error', notify.onError('<%= error.message %>'))
    .pipe(source(target+'.js'))
    .pipe(dest(DST_ASSETS+'/js'))
}

const appUser = () => {
  return js('app-user')
}
const appAdmin = () => {
  return js('app-admin')
}

// ----------------------------------------
// 画像ファイル（圧縮）
// ----------------------------------------

const IMGMIN_OPTION = [
  mozjpeg({
    quality: 70,
  }),
  imagemin.gifsicle(),
  imagemin.jpegtran(),
  imagemin.optipng(),
]

const images = () => {
  return src([
    SRC+'/img/**/*.+(jpg|jpeg|png|gif|svg)',
    '!'+SRC+'/img/favicons/*.ico'
  ])
    .pipe(changed(DST_ASSETS+'/img'))
    .pipe(imagemin(IMGMIN_OPTION))
    .pipe(dest(DST_ASSETS+'/img'))
}

// ----------------------------------------
// その他ファイル（）
// ----------------------------------------

const files = () => {
  return src(SRC+'/files/**/*')
    .pipe(changed(DST_ASSETS+'/files'))
    .pipe(imagemin(IMGMIN_OPTION))
    .pipe(dest(DST_ASSETS+'/files'))
}

// ----------------------------------------
// ファビコン（コピー）
// ----------------------------------------

const favicon = () => {
  return src(SRC+'/img/favicons/**/*.ico')
    .pipe(dest(DST_ASSETS+'/img/favicons'))
}

// ----------------------------------------
// フォント（コピー）
// ----------------------------------------

const fonts = () => {
  return src(SRC+'/fonts/**/*')
    .pipe(dest(DST_ASSETS+'/fonts'))
}

// ----------------------------------------
// PWA 設定ファイル（コピー）
// ----------------------------------------

const pwa = () => {
  return src(SRC+'/pwa/**/*')
    .pipe(dest(DST))
}

// ========================================
// 補助タスク
// ========================================

// ----------------------------------------
// ローカルサーバー・自動リロード
// ----------------------------------------

const BS_OPTION = {
  port: process.env.PORT || 3000,
  // ui: {
  //     port: 3001
  // },
  server: {
    baseDir: [
      DST,
      // '.static',
    ],
  },
  startPath: '__content/index.html',
  reloadOnRestart: true,
  ghostMode: false,
  open: false,
}

const browsersync = (done) => {
  browser.init(BS_OPTION)
  done()
}

// ========================================
// ファイルの監視
// ========================================

const watchFiles = (done) => {

  const RELOAD = () => {
    browser.reload()
    done()
  }

  // ----------------------------------------
  // DST 配下の監視 → 自動リロード
  // ----------------------------------------

  watch(DST+'/**/*.+!(css|map)').on('change', series(RELOAD))

  // ----------------------------------------
  // 自動コンパイル
  // ----------------------------------------

  watch(['**/*.json',SRC+'/**/*.pug']).on('change', series(pug_html))
  watch(SRC+'/**/*.scss').on('change', series(css))
  watch(SRC+'/vue/**/*').on('change', series(parallel(appUser,appAdmin)))
  watch(SRC+'/img/**/*.+(jpg|jpeg|png|gif|svg)',series(images))
  watch(SRC+'/**/*.ico').on('change', series(favicon))
  watch(SRC+'/files/**/*',series(files))
  watch(SRC+'/fonts/**/*',series(fonts))
  watch(SRC+'/pwa/**/*',series(pwa))
}

// ========================================
// NPM コマンド用のエクスポート
// ========================================

exports.default = parallel(parallel(appUser,appAdmin), css, pug_html, images, files, favicon, fonts, pwa)
exports.server = series(browsersync)
