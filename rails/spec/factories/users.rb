FactoryBot.define do
  factory :user do
    nickname { Faker::Name.name }
    sequence(:email) { |n| "test#{n}@example.com" }
    password 'password'

    height { rand(140..190) }
    gender { User.genders.keys.sample }
    age { User.ages.keys.sample }
    blood { User.bloods.keys.sample }
    income { User.incomes.keys.sample }
    education { User.educations.keys.sample }

    business { Faker::Job.title }
    birthplace { Faker::Address.country }

    sequence(:attracted_type) { |n|
      %w(
        頼もしい
        清潔感がある
        優しい
        ハイスペック
        顔がいい
        話してて楽しい
        普通の人
        趣味が合う
      ).sample }
    hobbies { |n|
      %w(
        スポーツ
        映画
        読書
        ダーツ
        旅行
        カメラ
        ドライブ
        ボルダリング
      ).sample }
    fashion { |n|
      %w(
        カジュアル
        ジャージ
        白Tシャツ
        きれいめ
        高級ブランド
        ストリート
        浴衣
        アメカジ
      ).sample }
    alcohol { Faker::Boolean.boolean }
    tobacco { Faker::Boolean.boolean }

    before(:create) do |user|
      # user.remote_avatar_image_url = Faker::Avatar.image unless Rails.env.test?
      # user.remote_cover_image_url = Faker::Placeholdit.image unless Rails.env.test?
    end

    trait :owner do
      role :owner
      sequence(:email) { |n| "test+owner#{n}@example.com" }
    end

    trait :admin do
      role :admin
      sequence(:email) { |n| "admin@example.com" }
    end
  end
end
