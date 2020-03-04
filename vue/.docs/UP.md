# 更新について

## テンプレート構成

### 索引

各画面への遷移用。  
開発者の確認用のページ。デプロイしない。

- `/__content/index.pug`

### ページについて

大きく分けて

1. ユーザー画面（ /user/ ）
2. 管理画面（ /admin/ ）
3. マスター画面（ /master/ ）

に分かれる。  
ただし、3 については ActiveAdmin で管理することとなったため、デプロイしない。

#### ユーザー画面

来場者（一般ユーザー）用の画面

- `/user/index.pug`  
  ユーザー画面TOP（ページ名: マイページ）
- `/user/regist/index.pug`  
  新規登録画面（ページ名: りあこねアカウントの作成）
- `/user/reset_password/index.pug`  
  パスワードの再設定画面（ページ名: パスワードの再設定）

#### 管理画面（アドミン）

店舗などの会場の管理者用の画面

- `/admin/index.pug`  
  管理画面TOP（ページ名: 店舗・会場管理）
- `/admin/login/index.pug`  
  管理画面用ログイン（ページ名: 店舗・会場管理 ログイン）
- `/admin/code/index.pug`  
  チェックインコード表示（ページ名: Check-in Code）

#### マスター画面 ※

りあこねシステム管理者用の画面。  
※ 現在 ActiveAdmin で管理しているためデプロイしない

- `/master/index.pug`  
  マスター画面（ページ名: システム管理者）

### 画面を構成する部品

部品は、ある時にはタマネギの様に入れ子の入れ子にして使われ、
またある時には、つみ木の様に並列でも使われる。  

それらの構造は、

1. ファンデーション
2. レイアウト
   1. ブロック
   2. アプリのヘッダー
   3. モーダル
   4. ペイン
   5. PC表示時のメニュー
3. オブジェクト

にカテゴライズしている。

#### ファンデーション

テンプレートの下地。基礎的な内容となる。

- `/_tpl/foundation/_variables.pug`  
  Pug で使用する変数を定義する

以降の `_base-*` は画面フレームすなわち一番の外枠となる。  
タマネギでいうところの「皮」。  
ここにレイアウトやオブジェクトの各パーツを配置する。

- `/_tpl/foundation/_base-app.pug`  
  ユーザー画面TOP、管理画面TOP、管理画面用ログイン、マスター画面
- `/_tpl/foundation/_base-account.pug`  
  新規登録画面、パスワードの再設定画面
- `/_tpl/foundation/_base-code.pug`  
  チェックインコード表示
- `/_tpl/foundation/_base-index.pug`  
  （開発者用の）索引ページ

※`_base-app` には serviceWorker の登録処理を記述している。  
他の画面を増やす際に PWA 対応する場合は、serviceWorker の script の記述をコピペすると良い。

#### レイアウト

レイアウトの構成用のテンプレート。

- `/_tpl/layout/_main.pug`  
  レイアウトの大枠（タマネギの皮を剥いて最初に現れる層）

##### レイアウト / アプリのヘッダー

PC で表示されるアプリのヘッダー部分。ユーザー・管理画面・マスターで分けている。  
ちなみにスマホでヘッダーに見える部分はこれではなく、各ペインのヘッダーである。

- `/_tpl/layout/header-app/_user.pug`
- `/_tpl/layout/header-app/_admin.pug`
- `/_tpl/layout/header-app/_master.pug`

##### レイアウト / ペイン

ペイン。と言えどスマホでは3つ重なっている。
ユーザー画面でのペインは下記の3つ。

- `/_tpl/layout/pane/_pane1.pug`  
  1枚目（PLACE・EVENT）
- `/_tpl/layout/pane/_pane2.pug`  
  2枚目（トーク一覧）
- `/_tpl/layout/pane/_pane3.pug`  
  3枚目（トークルーム）

マスター画面ではペインは一枚だけ。  
ただ、マスター画面は現在使用していないので、これを触る事は当面なさそう。

- `/_tpl/layout/pane/_pane-dashboard-master.pug`

1枚目のペインの会場詳細のところはソースが冗長になるので下記のファイルに格納している。

- `/_tpl/layout/pane/include/_place-detail.pug`

##### レイアウト / PC表示時のメニュー

PCで表示されている左サイドバーのメニューのソース。  
これもユーザー・管理画面・マスターで分けている。

- `/_tpl/layout/pc-menu/_user.pug`
- `/_tpl/layout/pc-menu/_admin.pug`
- `/_tpl/layout/pc-menu/_master.pug`

##### レイアウト / ブロック

ブロックはアカウントやプロフィールなどの設定のようなもの。

- `/_tpl/layout/block/menu/_user.pug`  
  メニュー（ユーザー画面で使用）※スマホでのみ表示される。
- `/_tpl/layout/block/menu/_admin.pug`  
  メニュー（管理画面とマスターで使用）※こちらもスマホでのみ表示される。
- `/_tpl/layout/block/_account.pug`  
  アカウント（ユーザー画面で使用）
- `/_tpl/layout/block/_admin-profile.pug`  
  店舗・会場情報（管理画面で使用）
- `/_tpl/layout/block/_feedback.pug`  
  問題を報告（ユーザー画面で使用）※内容未定のため現在メニューから削除
- `/_tpl/layout/block/_help.pug`  
  ヘルプ（ユーザー画面で使用）※内容未定のため現在メニューから削除
- `/_tpl/layout/block/_info.pug`  
  お知らせ（ユーザー画面で使用）※内容未定のため現在メニューから削除
- `/_tpl/layout/block/_license.pug`  
  ライセンス情報（ユーザー画面で使用）※内容未定のため現在メニューから削除
- `/_tpl/layout/block/_manage-event.pug`  
  イベント管理（マスター画面で使用）※ActiveAdminを使用中のため現時点では不要
- `/_tpl/layout/block/_manage-help.pug`  
  ヘルプ管理（マスター画面で使用）※ActiveAdminを使用中のため現時点では不要
- `/_tpl/layout/block/_manage-info.pug`  
  お知らせ管理（マスター画面で使用）※ActiveAdminを使用中のため現時点では不要
- `/_tpl/layout/block/_manage-license.pug`  
  ライセンス情報管理（マスター画面で使用）※ActiveAdminを使用中のため現時点では不要
- `/_tpl/layout/block/_manage-place.pug`  
  会場・店舗管理（マスター画面で使用）※ActiveAdminを使用中のため現時点では不要
- `/_tpl/layout/block/_manage-privacy.pug`  
  個人情報保護方針管理（マスター画面で使用）※ActiveAdminを使用中のため現時点では不要
- `/_tpl/layout/block/_manage-terms.pug`  
  利用規約管理（マスター画面で使用）※ActiveAdminを使用中のため現時点では不要
- `/_tpl/layout/block/_manage-user.pug`  
  ユーザー管理（マスター画面で使用）※ActiveAdminを使用中のため現時点では不要
- `/_tpl/layout/block/_privacy.pug`  
  個人情報保護方針（ユーザー画面で使用）
- `/_tpl/layout/block/_release.pug`  
  現在のバージョン（ユーザー画面で使用）※内容未定のため現在メニューから削除
- `/_tpl/layout/block/_setting.pug`  
  アプリ設定（ユーザー画面で使用）
- `/_tpl/layout/block/_terms.pug`  
  利用規約（ユーザー画面で使用）
- `/_tpl/layout/block/_user-profile.pug`  
  プロフィール（ユーザー画面で使用）
- `/_tpl/layout/block/_version.pug`  
  バージョン情報（ユーザー画面で使用）※内容未定のため現在メニューから削除

##### レイアウト / モーダル

クリックで表示される各モーダル。

- `/_tpl/layout/modal/_admin-detail.pug`
- `/_tpl/layout/modal/_area-change.pug`
- `/_tpl/layout/modal/_check-in.pug`
- `/_tpl/layout/modal/_delete-account.pug`
- `/_tpl/layout/modal/_event-add.pug`
- `/_tpl/layout/modal/_event-edit.pug`
- `/_tpl/layout/modal/_help-add.pug`
- `/_tpl/layout/modal/_help-edit.pug`
- `/_tpl/layout/modal/_info-add.pug`
- `/_tpl/layout/modal/_info-edit.pug`
- `/_tpl/layout/modal/_log-in.pug`
- `/_tpl/layout/modal/_place-add.pug`
- `/_tpl/layout/modal/_place-edit.pug`
- `/_tpl/layout/modal/_user-add.pug`
- `/_tpl/layout/modal/_user-detail.pug`
- `/_tpl/layout/modal/_user-edit.pug`
- `/_tpl/layout/modal/_user-log-in.pug`

#### オブジェクト

- `/_tpl/object/_head.pug`  
  `<head>` タグの内容（メタ周りなど）を記載。
- `/_tpl/object/_script.pug`  
  `<body>` の閉じタグ直前に読み込むJSの指定を記述。
- `/_tpl/object/_load-status.pug`  
  ユーザー画面のデータ読み込み中の画面。APIでデータが返ってくるまでに時間がかかるのと、エラー発生位置から手動で再試行させたり、何らかの不具合でログインできない時にCookieを消してアカウントを切り替えられる機能を持つ。
- `/_tpl/object/_new-regist.pug`  
  ユーザー新規登録画面

## SCSS

次の3つのレイヤーと、**Object**レイヤーの子レイヤーで構成している。

1. Foundation - reset/normalize/base...
2. Layout - header/main/sidebar/footer...
3. Object
   1. Component - grid/button/form/media...
   2. Project - articles/ranking/promo...
   3. Utility - clearfix/display/margin...

他のOOCSSに基づくフレームワークおよびスタイルガイドと同様に、
再利用性や拡張性を持たせるために、これらのルールで分類を行う。

### Foundation

Reset.cssやNormalize.cssなどを用いたブラウザのデフォルトスタイルの初期化や、プロジェクトにおける基本的なスタイルを定義。  
ページの下地としての全体の背景や、基本的なタイポグラフィなどが該当する。

### Layout

ページを構成するヘッダーやメインのコンテンツエリア、サイドバーやフッターといったプロジェクト共通のコンテナーブロックのスタイルを定義。

基本的には、ページ単位で唯一の存在である要素となるため、Layoutレイヤーの要素ではIDセレクタを採用することも可能。  
ただしIDセレクタは高い詳細度を持つため、それを懸念する場合には、`l-*` プレフィックスをつけた命名を採用する。

### Object

OOCSSのコンセプトを元に、プロジェクトにおける繰り返されるビジュアルパターンをすべて**Object**と定義し、さらに次の3つのレイヤーにカテゴライズする。

#### 1. Component

再利用できるパターンとして、小さな単位のモジュールを定義。

#### 2. Project

プロジェクト固有のパターンであり、いくつかのComponentと、それに該当しない要素によって構成されるものを定義。

#### 3. Utility

Component と Project レイヤーの Object のモディファイアで解決することが難しい・適切では無い、わずかなスタイルの調整のための便利クラスなどを定義。

Utilityは、Component、ProjectレイヤーのObjectを無尽蔵に増やしてしまうことを防いだり、またこれらのObject自体が持つべきではない`margin`の代わりに`.mbs { margin-bottom: 10px; }`のようなUtility Objectを用いて、隣接するモジュールとの間隔をつくるといった役割を担う。

## CSS クラスの命名規則について

### MindBEMding

[BEM](http://bem.info/)システムのシンタックスである、**Block**、**Element**、**Modifier**に分類して構成される規則を採用する。

また、オリジナルのBEMのシンタックスではなく、[MindBEMding](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)
のアイデアを基本的にそのまま取り入れる。

Modifierの命名の派生パターンとして、JavaScriptで操作されるような「状態」を表すようなModifierについては、SMACSSの**State**パターンの命名を拝借し、`is-*` プレフィックスを付与し、`.is-active` というようにする。

### プレフィックス

モジュールは役割を明確にするためにプレフィックスをつける。

- Layout    - `.l-*`
- Component - `.c-*`
- Project   - `.p-*`
- Utility   - `.u-*`

## Vue.js について

ユーザー画面・管理画面・マスター画面それぞれ、バンドル後の下記ファイルを読み込んでいる。  
（CDN を除いて、基本的に1ファイルのみの読み込みがなされる）

1. ユーザー画面: `app-user.js`
2. 管理画面: `app-admin.js`
3. マスター画面: `app-master.js`

### 構成

各処理についてはソース内に適宜コメントを残す様にしているので割愛。

#### Vue単一コンポーネント

- `/App.vue`  
  アプリケーションフレームをVue単一コンポーネントとして利用する。  
  ここで編集する作業は基本的にほぼ発生しない。

#### components

アプリケーション内で利用するコンポーネント。

管理画面側のVue単一コンポーネント

- `/components/admin/account.vue`
- `/components/admin/charts/rate-of-age-chart.vue`
- `/components/admin/charts/users-line-chart.vue`
- `/components/admin/dashboard.vue`
- `/components/admin/privacy.vue`
- `/components/admin/profile.vue`
- `/components/admin/terms.vue`

管理画面・ユーザーともに汎用的に利用するもの

- `/components/loading.vue`
- `/components/noweventlist.vue`
- `/components/pasteventlist.vue`
- `/components/placelist.vue`
- `/components/talklist.vue`
- `/components/talkroom.vue`

#### lib

管理画面側で利用する Filter と API の通信の処理。

- `/lib/filters.js`
- `/lib/request.js`

#### router

Vue.js のルーティング制御。

- `/router/admin-router.js`

#### modules

Umbrella 側でのDOM操作に使う各モジュール。

- `/modules/_block.js`
- `/modules/_editor.js`
- `/modules/_flick.js`
- `/modules/_imagePreview.js`
- `/modules/_menu.js`
- `/modules/_objectFit.js`
- `/modules/_pane.js`
- `/modules/_pcMenu.js`
- `/modules/_selectImage.js`
- `/modules/_standalone.js`
- `/modules/_toast.js`
- `/modules/_ua.js`

## その他 ディレクトリ

- `/_src/img/`  
  画像ファイル (jpg|jpeg|png|gif|svg) 圧縮。  
  ※`/_src/img/favicons/**/*.ico` はコピーのみ。
- `/_src/fonts/`  
  フォント（コピーのみ）
- `/_src/pwa/`  
  PWA用のJSON・JS（コピーのみ）
- `/_src/files/`  
  それ以外でフロントエンドでそのまま使用する各種ファイル。現状はMP4が入っている程度だが、PDFやZIPなど、ファイルの種類に関係なく利用できる。
