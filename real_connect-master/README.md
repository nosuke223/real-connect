# Real Connect Backend

リアルコネクトの管理画面&APIサーバー

## 環境構築

### stack

```
ruby v2.5.1
postgresql v10.10
```

```bash
bundle install
bundle exec rake db:drop db:create db:migrate

# ダミーデータを追加する場合
bundle exec rake app:dev:admin
bundle exec rake app:dev:sample
```

### 環境変数

```
# DB

- DATABASE_URL

# s3に接続するために必要なAWSアカウント情報

- AWS_ACCESS_KEY
- AWS_SECRET_KEY
- AWS_REGION
- AWS_S3_HOST
- AWS_S3_BUCKET_NAME
- AWS_S3_ASSET_HOST

# SendGrid

- SENDGRID_USERNAME
- SENDGRID_PASSWORD
```
