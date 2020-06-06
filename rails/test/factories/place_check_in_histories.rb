FactoryBot.define do
  factory :place_check_in_history do
    place_id { 1 }
    user_id { 1 }
    checked_in_at { "2020-06-05 14:28:17" }
    checked_out_at { "2020-06-05 14:28:17" }
  end
end
