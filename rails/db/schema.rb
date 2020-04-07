# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_04_01_112639) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id"
  end

  create_table "areas", force: :cascade do |t|
    t.string "name"
    t.integer "prefecture"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_areas_on_deleted_at"
  end

  create_table "event_places", force: :cascade do |t|
    t.integer "event_id"
    t.integer "place_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_event_places_on_deleted_at"
    t.index ["event_id"], name: "index_event_places_on_event_id"
    t.index ["place_id"], name: "index_event_places_on_place_id"
  end

  create_table "event_users", force: :cascade do |t|
    t.integer "event_id"
    t.integer "user_id"
    t.datetime "checked_out_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.integer "gender"
    t.index ["deleted_at"], name: "index_event_users_on_deleted_at"
    t.index ["event_id"], name: "index_event_users_on_event_id"
    t.index ["user_id"], name: "index_event_users_on_user_id"
  end

  create_table "events", force: :cascade do |t|
    t.integer "area_id"
    t.string "name"
    t.string "check_in_code"
    t.datetime "start_time"
    t.datetime "end_time"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_events_on_deleted_at"
  end

  create_table "messages", force: :cascade do |t|
    t.integer "event_id", null: false
    t.integer "sender_id", null: false
    t.integer "partner_id", null: false
    t.string "body"
    t.string "image"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["created_at"], name: "index_messages_on_created_at"
    t.index ["deleted_at"], name: "index_messages_on_deleted_at"
    t.index ["event_id"], name: "index_messages_on_event_id"
    t.index ["partner_id"], name: "index_messages_on_partner_id"
    t.index ["sender_id"], name: "index_messages_on_sender_id"
  end

  create_table "place_users", force: :cascade do |t|
    t.integer "place_id"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.integer "age"
    t.index ["created_at"], name: "index_place_users_on_created_at"
    t.index ["deleted_at"], name: "index_place_users_on_deleted_at"
    t.index ["place_id"], name: "index_place_users_on_place_id"
    t.index ["user_id"], name: "index_place_users_on_user_id"
  end

  create_table "places", force: :cascade do |t|
    t.integer "owner_id"
    t.string "name"
    t.integer "area_id"
    t.string "address1"
    t.string "telephone"
    t.string "url"
    t.string "logo_image"
    t.string "cover_image"
    t.string "store_type"
    t.string "description"
    t.string "note"
    t.integer "seat_status", default: 1000, null: false
    t.time "sun_start_at"
    t.time "sun_end_at"
    t.boolean "is_sun_holiday", default: false, null: false
    t.time "mon_start_at"
    t.time "mon_end_at"
    t.boolean "is_mon_holiday", default: false, null: false
    t.time "tue_start_at"
    t.time "tue_end_at"
    t.boolean "is_tue_holiday", default: false, null: false
    t.time "wed_start_at"
    t.time "wed_end_at"
    t.boolean "is_wed_holiday", default: false, null: false
    t.time "thu_start_at"
    t.time "thu_end_at"
    t.boolean "is_thu_holiday", default: false, null: false
    t.time "fri_start_at"
    t.time "fri_end_at"
    t.boolean "is_fri_holiday", default: false, null: false
    t.time "sat_start_at"
    t.time "sat_end_at"
    t.boolean "is_sat_holiday", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.integer "place_users_count", default: 0, null: false
    t.string "zipcode", limit: 8
    t.string "address2"
    t.string "address3"
    t.index ["area_id"], name: "index_places_on_area_id"
    t.index ["deleted_at"], name: "index_places_on_deleted_at"
    t.index ["owner_id"], name: "index_places_on_owner_id"
  end

  create_table "prefectures", force: :cascade do |t|
    t.integer "region_id"
    t.string "code"
    t.string "name"
    t.string "kana"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "regions", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "talks", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "partner_id", null: false
    t.integer "event_id", null: false
    t.integer "last_message_id"
    t.datetime "last_read_at"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_talks_on_deleted_at"
    t.index ["event_id"], name: "index_talks_on_event_id"
    t.index ["partner_id"], name: "index_talks_on_partner_id"
    t.index ["user_id"], name: "index_talks_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.integer "role"
    t.string "nickname"
    t.string "avatar_image"
    t.string "cover_image"
    t.integer "area_id"
    t.integer "height"
    t.integer "age"
    t.integer "blood"
    t.integer "gender"
    t.integer "income"
    t.integer "education"
    t.integer "prefecture"
    t.boolean "alcohol"
    t.boolean "tobacco"
    t.string "business"
    t.string "birthplace"
    t.string "attracted_type"
    t.string "hobbies"
    t.string "fashion"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.integer "current_place_id"
    t.integer "last_place_id"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["deleted_at"], name: "index_users_on_deleted_at"
    t.index ["email"], name: "index_users_on_email"
    t.index ["email"], name: "unique_index_on_users_email", unique: true, where: "(deleted_at IS NULL)"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
  end

end
