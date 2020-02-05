# 概要

※ 更新については [UP.md](./.docs/UP.md) を参照ください。

コマンド `npm start` を用意していますので、Gulp のグローバルインストールは不要です。  
`node.js` のみで動作します。  
（gulp コマンドを使用したい場合は後述のグローバルインストールをお願いします。※任意）  
開発に必要な NPM （＝devDependencies）は開発時点の最新バージョンにしています。

## 環境

[node.js](https://nodejs.org/ja/) のインストールが必要です。  
未インストールの場合は LTS 版をPCにインストールしてください。

試していませんが、コマンドラインから入れる場合は [こちら](https://qiita.com/akakuro43/items/600e7e4695588ab2958d) などが参考になるかと思います。

## 初期設定

**1. node.js**（未インストールの場合）  
未インストールの場合は [node.js](https://nodejs.org/ja/) にアクセスして LTS 版をPCにインストールしてください。  
（インストール済みの場合はこの手順は飛ばしてください。）

**2. npm install**  
リポジトリを Clone したら、ターミナルでクローンしたローカルリポジトリのルートへ移動し、 `npm install` で必要なモジュールをインストールしてください。  

NPM のインストールが完了すると初期ファイルが `dest` ディレクトリに生成され、監視状態になります。  
ブラウザが起動し、ターミナルでエラーが出ていなければ環境構築に成功しています。

パッケージのローカルで Gulp が走る設定をしているので、グローバルインストールは不要です。  
グローバルインストールしたい場合は [ローカル開発環境のセットアップ手順#Gulp のインストール](https://github.com/waka-simesava/docs/blob/master/set-up.md#gulp-%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB) などを参考にしてください。

## ビルドおよびローカル開発

- `npm start` : 開発モード（開発用ソース一式生成とローカルサーバー起動、ソースの監視）

> *Note:*  
> 本プロジェクト開発時の Node.js のバージョンは 10.16.0、  
> npm のバージョンは 6.9.0 です。  
> Node.js のバージョンの違いによりインストールできない npm が発生することがありますので、できる限り開発時のバージョンに合わせてください。  
> なお、 Node.js のアップデート、バージョン切り替え等については [NODE.md](./.docs/NODE.md) を参照ください。

## 開発・更新に関して

HTML のテンプレートエンジンとして Pug を使用しています。  
Pug については [PUG.md](./.docs/PUG.md) を参照ください。

任意ですが、エディタのデフォルトで Linter やハイライトが当たっていない場合は、お使いのエディタに適宜パッケージやプラグインを追加してください。

- VS Code の場合 : ~~Pug（ハイライトされる条件がまちまちなので他を調査中…）など~~ デフォルト
- Atom の場合 : language-pug, linter など
- Sublime の場合 : Pug, SublimeLinter-contrib-pug-lint など

**整形ルール**  
ソースコードの一貫性を保持するため、 [.editorconfig](./.editorconfig) を設定しています。  
[.editorconfig] の概要や設定方法については [こちらの記事](https://qiita.com/naru0504/items/82f09881abaf3f4dc171) を参照ください。

- VS Code の場合 : [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- Atom の場合 : [EditorConfig](https://atom.io/packages/editorconfig)
- Sublime Text の場合 : [EditorConfig](https://packagecontrol.io/packages/EditorConfig)


### 開発ディレクトリ（ `_src` ）、公開用ディレクトリ（ `dest` ）

`_src` ディレクトリが開発用（ローカルプレビュー用）です。生成されたファイルは `dest` ディレクトリに入ります。  
もしこれらの設定を変更したい場合は `gulpfile.js` の下記の箇所を任意に修正してください。

```js
const
  SRC = './_src',
  DST = './dest',
  DST_ASSETS = DST+'/_assets'
```

## 注意点

`dest` ディレクトリ内で直接ファイルを追加・編集・削除することは基本的に行わない想定です。  
そのため、コンパイル後の `dest` は監視対象外としており、初回クローン時にファイルは含まれません。  

この設定を変更したい場合は `.gitignore` を適宜修正ください。  

## Gulp の設定変更に関して

基本的な設定は完了していますので、吐き出し先の変更などについては見通せるようにはしていますが、大幅に設定を変える必要があったり、手の混んだ事をしたい場合など、よくわからなそうであれば Gulp 設定者に相談いただくか、 [こちらの記事](https://ics.media/entry/3290/) の様に概要と導入の記事を参考にされてください。
