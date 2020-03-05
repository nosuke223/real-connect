# real-connect-dev
りあこね開発環境

Rails環境はDocker、Vue.js環境はMac上でサーバーを立ち上げる

## 導入手順

### 1. Dockerコンテナ起動
```bash
$ docker-compose up -d
```

### 2. 管理画面アカウント&ダミーデータ投入方法
- `rails/app/models/user.rb`の174 ~ 191行目をコメントアウト(バリデーションを無効化)
- 以下コマンドを実行
```
$ docker-compose run admin_web sh -c 'bin/rake db:create db:migrate db:seed && bin/rake app:dev:admin && bin/rake app:dev:sample'
```

### 3. りあこねNodeパッケージインストール&サーバー立ち上げ
```
$ node -v
# 開発時のnodeバージョンは「v10.16.0」

$ cd vue
$ npm install
$ npm start
```

## 確認URL

管理画面 ※一度ログインするとログアウトできない（Cookieを削除するしかない）
- URL : `http://localhost:8080/admin`
- 管理者メールアドレス : `admin@example.com`
- 管理者PASS: : `password`

りあこね
- URL : `http://localhost:3000/user`
- メールアドレス : `test1@example.com` (test1 ~ 10まである)
- 管理者PASS: : `password`

りあこね管理画面
- URL : `http://localhost:3000/admin`
- メールアドレス : `admin@example.com`
- 管理者PASS: : `password`
