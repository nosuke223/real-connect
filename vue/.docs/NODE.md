# Node.js / NPM のアップデート

[Node.jsとnpmをアップデートする方法](https://parashuto.com/rriver/tools/updating-node-js-and-npm) より抜粋

> [n](https://github.com/tj/n) という便利なバージョン管理ツールがあるので、これを使ってバージョンを確認してアップデートします。  
> [n](https://github.com/tj/n) の詳しい使い方は、「でこてっくろぐ」さんの [こちらの記事](http://dekokun.github.io/posts/2014-01-01.html) あたりをご参照いただくと良いと思います。[n](https://github.com/tj/n) を使う際の注意点もしっかり説明されています。

## [n](https://github.com/tj/n) のインストール

```bash
npm install -g n
```

## Node.js / NPM のバージョンの確認

### Node.js のバージョンの確認

```bash
node -v
```

### NPM のバージョンの確認

```bash
npm -v
```

## Stable（推奨版最新バージョン）の確認方法

```bash
n --stable
```

## Stable のインストール

```bash
n stable
```

`Error: sudo required` 等、環境によっては `sudo n stable` のように sudo コマンドが必要になります。

Node.js / NPM がアップデート出来たかを確認します。

```bash
node -v
```

```bash
npm -v
```
