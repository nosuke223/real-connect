# frozen_string_literal: true

FactoryBot.define do
  factory :temp_area do
    name { Faker::Pokemon.location }
    prefecture_id { 1 }
    zipcode { '8160134'.to_i }
    application_comment { '○○の理由で申請します' }
    application_status { 1 }
    application_email { 'test100@example.com' }
  end
end
