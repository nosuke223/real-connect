# frozen_string_literal: true

FactoryBot.define do
  factory :temp_place do
    owner_id { 1 }
    name { 'test' }
    area_id { 1 }
    address1 { 'テスト県' }
    telephone { '0123456' }
    url { '' }
    logo_image { 'logo_image.png' }
    cover_image { 'cover_image.png' }
    store_type { '居酒屋' }
    description { '都内にある素敵な隠れ家' }
    note { '' }
    seat_status { 1 }
    sun_start_at { '2020-06-14 15:04:47' }
    sun_end_at { '2020-06-14 15:04:47' }
    is_sun_holiday { false }
    mon_start_at { '2020-06-14 15:04:47' }
    mon_end_at { '2020-06-14 15:04:47' }
    is_mon_holiday { false }
    tue_start_at { '2020-06-14 15:04:47' }
    tue_end_at { '2020-06-14 15:04:47' }
    is_tue_holiday { false }
    wed_start_at { '2020-06-14 15:04:47' }
    wed_end_at { '2020-06-14 15:04:47' }
    is_wed_holiday { false }
    thu_start_at { '2020-06-14 15:04:47' }
    thu_end_at { '2020-06-14 15:04:47' }
    is_thu_holiday { false }
    fri_start_at { '2020-06-14 15:04:47' }
    fri_end_at { '2020-06-14 15:04:47' }
    is_fri_holiday { false }
    sat_start_at { '2020-06-14 15:04:47' }
    sat_end_at { '2020-06-14 15:04:47' }
    is_sat_holiday { false }
    place_users_count { 1 }
    zipcode { '8100000' }
    address2 { 'テスト市5-2' }
    address3 { '○アパート' }
    payment_flag { false }
    last_payment_at { '2020-06-14 15:04:47' }
    application_comment { '○○の理由で申請します' }
    application_status { 1 }
    application_email { 'test200@example.com' }
  end
end
