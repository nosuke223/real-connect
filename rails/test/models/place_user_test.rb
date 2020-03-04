# == Schema Information
#
# Table name: place_users
#
#  id         :bigint(8)        not null, primary key
#  place_id   :integer
#  user_id    :integer
#  event_id   :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  deleted_at :datetime
#

require 'test_helper'

class PlaceUserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
