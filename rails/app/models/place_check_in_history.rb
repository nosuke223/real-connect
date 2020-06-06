# == Schema Information
#
# Table name: place_check_in_histories
#
#  id             :bigint(8)        not null, primary key
#  checked_in_at  :datetime
#  checked_out_at :datetime
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  place_id       :integer          not null
#  user_id        :integer          not null
#

class PlaceCheckInHistory < ApplicationRecord
end
