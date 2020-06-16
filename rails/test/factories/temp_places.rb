FactoryBot.define do
  factory :temp_place do
    owner_id { 1 }
    name { "MyString" }
    area_id { 1 }
    address1 { "MyString" }
    telephone { "MyString" }
    url { "MyString" }
    logo_image { "MyString" }
    cover_image { "MyString" }
    store_type { "MyString" }
    description { "MyString" }
    note { "MyString" }
    seat_status { 1 }
    sun_start_at { "2020-06-14 15:04:47" }
    sun_end_at { "2020-06-14 15:04:47" }
    is_sun_holiday { false }
    mon_start_at { "2020-06-14 15:04:47" }
    mon_end_at { "2020-06-14 15:04:47" }
    is_mon_holiday { false }
    tue_start_at { "2020-06-14 15:04:47" }
    tue_end_at { "2020-06-14 15:04:47" }
    is_tue_holiday { false }
    wed_start_at { "2020-06-14 15:04:47" }
    wed_end_at { "2020-06-14 15:04:47" }
    is_wed_holiday { false }
    thu_start_at { "2020-06-14 15:04:47" }
    thu_end_at { "2020-06-14 15:04:47" }
    is_thu_holiday { false }
    fri_start_at { "2020-06-14 15:04:47" }
    fri_end_at { "2020-06-14 15:04:47" }
    is_fri_holiday { false }
    sat_start_at { "2020-06-14 15:04:47" }
    sat_end_at { "2020-06-14 15:04:47" }
    is_sat_holiday { false }
    deleted_at { "2020-06-14 15:04:47" }
    place_users_count { 1 }
    zipcode { "MyString" }
    address2 { "MyString" }
    address3 { "MyString" }
    payment_flag { false }
    last_payment_at { "2020-06-14 15:04:47" }
    application_comment { "MyString" }
    application_status { 1 }
    application_email { "MyString" }
  end
end
