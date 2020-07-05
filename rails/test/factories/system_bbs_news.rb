# frozen_string_literal: true

require 'date'

FactoryBot.define do
  factory :system_bbs_news do
    detail { 'アプリをリリースしました！' }
    display_flag { true }
    display_date { Date.today }
  end
end
