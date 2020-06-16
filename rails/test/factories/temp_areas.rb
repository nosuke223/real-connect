FactoryBot.define do
  factory :temp_area do
    name { "MyString" }
    prefecture_id { 1 }
    deleted_at { "2020-06-14 14:44:22" }
    zipcode { "MyString" }
    application_comment { "MyString" }
    application_status { 1 }
    application_email { "MyString" }
  end
end
