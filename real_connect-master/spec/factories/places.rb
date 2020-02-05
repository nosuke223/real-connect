FactoryBot.define do
  factory :place do
    name { |n|
      %w(
        Alone Together 天神大名
        Bar SUNRISE 天神今泉
        膳 ~ zen 大名酒場
        club ALMA
        Bal Matz-core.imaizumi
        呑喰処 まるもや
        Bar New Nature
        いかや クラーケン
      ).sample }
    address { Faker::Address.street_name }
    building { Faker::Address.secondary_address }
    telephone { Faker::PhoneNumber.phone_number.delete('-') }
    description { '一流イタリアンシェフとのコラボレーションによって実現した「逢える・話せるトークバル」です。今までの「相席」とはひと味違うサービスをお楽しみください。天神駅から徒歩7分という好立地にある当店は、福岡の男女の出会いや交流の場としても賑わっています！街コンや恋活イベントも定期的に実施しています♪' }
    
    logo_image { File.open('spec/fixtures/images/place_logo.png') } unless Rails.env.test?

    before(:create) do |user|
      user.remote_cover_image_url = Faker::Placeholdit.image('320x160', 'png', format('%06x', (rand * 0xffffff))) unless Rails.env.test?
    end
  end
end
