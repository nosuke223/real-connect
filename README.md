# real-connect-dev
りあこね開発環境

Rails環境はDocker、Vue.js環境はMac上でサーバーを立ち上げる

## 導入手順

### 1. Dockerコンテナ起動
```bash
$ docker-compose up -d
```

### 2. 管理画面アカウント&ダミーデータ投入方法
- `rails/app/models/user.rb`の178 ~ 199行目あたりをコメントアウト(バリデーションを無効化)
- 以下コマンドを実行
```
$ docker-compose run admin_web sh -c 'bin/rake db:create db:migrate db:seed && bin/rake app:dev:admin && bin/rake app:dev:sample && bin/rake import:regions && bin/rake import:prefectures'
```
- `rails/app/models/user.rb`の178 ~ 199行目あたりのコメントアウトを解除(バリデーションをもとに戻す)

### 3. WordPressの初期設定
- http://localhost:8000 にアクセスしwordpressの操作を実施（任意のものでok）
- wordpress管理画面にログインして 外観>テーマ選択&プラグインを全て有効化する
- 別途送付するSQLファイルをwordpressのDBに適用する
- http://localhost:8000 にアクセスしてヘッダー・フッターから店舗申請フォームに移動できることを確認する

## 確認URL

### りあこね（ユーザ用のアプリ）
- URL : `http://localhost:3000/user`
- メールアドレス : `test1@example.com` (test1 ~ 10まである)
- 管理者PASS: : `password`

### りあこね管理画面（店舗管理者用のアプリ）
- URL : `http://localhost:3000/admin`
- 店舗管理者メールアドレス : `test+owner1@example.com`
- 管理者PASS: : `password`

### システム管理画面（システム管理者が見る画面）
- URL : `http://localhost:3002/login`
- 管理者メールアドレス : `admin@example.com`
- 管理者PASS: : `password`

### りあこねホームページ（WordPress）
- URL : http://localhost:8000/

### 開発環境用MailCatcher（開発環境で送信したメールは実際のメールアドレスにには送信されずにここで確認できる）
- URL : http://localhost:1080/

### 開発環境用Browsersyncの設定画面
- URL : http://localhost:3001/
