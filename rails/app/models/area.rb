# == Schema Information
#
# Table name: areas
#
#  id            :bigint(8)        not null, primary key
#  deleted_at    :datetime
#  name          :string
#  zipcode       :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  prefecture_id :bigint(8)
#
# Indexes
#
#  index_areas_on_deleted_at  (deleted_at)
#

class Area < ApplicationRecord
  acts_as_paranoid
  include CommonModule

  # -------------------------------------------------------------------------------
  # Relations
  # -------------------------------------------------------------------------------
  has_many :events
  has_many :places
  belongs_to :prefecture, class_name: :Prefecture , foreign_key: :prefecture_id , primary_key: :id, optional: true

  # -------------------------------------------------------------------------------
  # Enums
  # -------------------------------------------------------------------------------
  # enum prefecture: {
  #   hokkaido: 1,
  #   aomori: 2,
  #   iwate: 3,
  #   miyagi: 4,
  #   akita: 5,
  #   yamagata: 6,
  #   fukushima: 7,
  #   ibaraki: 8,
  #   tochigi: 9,
  #   gunma: 10,
  #   saitama: 11,
  #   chiba: 12,
  #   tokyo: 13,
  #   kanagawa: 14,
  #   niigata: 15,
  #   toyama: 16,
  #   ishikawa: 17,
  #   fukui: 18,
  #   yamanashi: 19,
  #   nagano: 20,
  #   gifu: 21,
  #   shizuoka: 22,
  #   aichi: 23,
  #   mie: 24,
  #   shiga: 25,
  #   kyoto: 26,
  #   osaka: 27,
  #   hyogo: 28,
  #   nara: 29,
  #   wakayama: 30,
  #   tottori: 31,
  #   shimane: 32,
  #   okayama: 33,
  #   hiroshima: 34,
  #   yamaguchi: 35,
  #   tokushima: 36,
  #   kagawa: 37,
  #   ehime: 38,
  #   kochi: 39,
  #   fukuoka: 40,
  #   saga: 41,
  #   nagasaki: 42,
  #   kumamoto: 43,
  #   oita: 44,
  #   miyazaki: 45,
  #   kagoshima: 46,
  #   okinawa: 47
  # }
end
