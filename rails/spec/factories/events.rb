FactoryBot.define do
  factory :event do
    name { Faker::Music.band }
    start_time { Date.today + rand(0..5).days + 10.hours }
    end_time { start_time + 14.hours }
  end
end
