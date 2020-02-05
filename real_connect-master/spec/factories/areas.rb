FactoryBot.define do
  factory :area do
    name { Faker::Pokemon.location }
  end
end
