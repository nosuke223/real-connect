# real-connect-dev
りあこね開発環境

## 導入手順

### 1. Dockerコンテナ起動
```bash
$ docker-compose up -d
```

### 2. 管理画面アカウント&ダミーデータ投入方法
- `rails/app/models/user.rb`の174 ~ 191行目をコメントアウト(バリデーションを無効化)
- 以下コマンドを実行
```
$ docker-compose run admin_web bin/rake db:create db:migrate db:seed
$ docker-compose run admin_web bin/rake app:dev:admin
$ docker-compose run admin_web bin/rake app:dev:sample
```

## 確認URL

管理画面 ※一度ログインするとログアウトできない（Cookieを削除するしかない）
- URL : `http://localhost:8080/admin`
- 管理者メールアドレス : `admin@example.com`
- 管理者PASS: : `password`

りあこね
- URL : `http://localhost:3000/__content/index.html`