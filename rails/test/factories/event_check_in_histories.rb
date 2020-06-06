FactoryBot.define do
  factory :event_check_in_history do
    event_id { 1 }
    user_id { 1 }
    checked_in_at { "2020-06-05 14:21:03" }
    checked_out_at { "2020-06-05 14:21:03" }
  end
end
