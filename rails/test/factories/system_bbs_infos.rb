# frozen_string_literal: true

require 'date'

FactoryBot.define do
  factory :system_bbs_info do
    detail { 'アプリをメンテナンスします' }
    display_flag { true }
    display_date { Date.today }
  end
end
