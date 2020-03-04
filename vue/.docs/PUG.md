# Pug について

Pug は HTML を効率的に書くための技術です。  
Pug はコンパイラを通すと完全に静的な HTML が生成されます。  
基本的な特徴は下記のようなものになります。

- HTML を生成する技術です
- タグで囲まない代わりに、改行とインデントでタグの入れ子を実現しています
- ヘッダー・フッター等の共通部分を別ファイルで管理できます

```pug
//- pug の記述例
div.hoge
  h2.hoge-title タイトル
  div.hoge-button
    a(href='#' target='_blank') リンク
  p.hoge-text テキスト
```

```html
<!-- できあがった html -->
<div class="hoge">
  <h2 class="hoge-title">タイトル</h2>
  <div class="hoge-button"><a href="#" target="_blank">リンク</a></div>
  <p class="hoge-text">テキスト</p>
</div>
```

sass をイメージしていただくと良いかと思います。  
実際に生成後のイメージを [こちらのサイト](https://pughtml.com/) で試すことができますので練習などに利用してください。

また、本案件ではさらに応用することで下記のような事を行なっています。

- サイト全体の設定や記事の一覧を管理する json を読み込んでいます
- JS の様に if else 等の演算や変数・関数を利用しています
- 設定を変えることでHTMLファイルの圧縮が可能になっています

---

## id, class の指定方法

- css のセレクタと同様に、id は `#` 、class は `.` で表記します

```pug
//- 変換前（pug）
section#hoge.foo.fuga
  div.piyo テキストが入ります。テキストが入ります。
```

```html
<!-- 変換後（html） -->
<section class="foo fuga" id="hoge">
  <div class="piyo">テキストが入ります。テキストが入ります。</div>
</section>
```

※ id, class を持つ `div` の場合は、`div` を省略できます。
例 :

```pug
//- 下記はどちらも同じです。
div.fuga テキストが入ります
.fuga テキストが入ります
```

---

## 属性の指定方法

- 属性はカッコで囲みます
- 属性が複数ある場合はスペースを入れます

```pug
//- 変換前（pug）
a(href='https://test.co.jp/' target='_blank')
  img(src='img/test.png' width='300' height='300' alt='代替テキスト')
```

```html
<!-- 変換後（html） -->
<a href="https://test.co.jp/" target="_blank">
  <img src="img/test.png" width="300" height="300" alt="代替テキスト">
</a>
```

---

## テキストの記述方法

- タグの後に書く場合は半角を空けます
- 複数行になる場合は `|` を使います

```pug
//- 変換前（pug）
p.test1 ダミーテキストです。
p.test2
  | ここに文字が入ります。
  | 複数行です。
p.test3
  | ここに文字が入ります。
  br
  | 複数行です。
//- `.test3` はこのように書くことも出来ます。
p.test3 ここに文字が入ります。
  br
  | 複数行です。
```

```html
<!-- 変換後（html） -->
<p class="test1">ダミーテキストです。</p>
<p class="test2">ここに文字が入ります。 複数行です。</p>
<p class="test3">ここに文字が入ります。<br>複数行です。</p>
<!-- `.test3` はこのように書くことも出来ます。 -->
<p class="test3">ここに文字が入ります。<br>複数行です。</p>
```

---

## コメントアウトの方法

```pug
// HTMLに残すコメント
//- HTMLに残さないコメント
```

上記は下記のようになります。

```html
<!-- HTMLに残すコメント -->
```
