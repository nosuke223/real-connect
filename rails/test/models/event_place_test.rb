# == Schema Information
#
# Table name: event_places
#
#  id         :bigint(8)        not null, primary key
#  event_id   :integer
#  place_id   :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  deleted_at :datetime
#

require 'test_helper'

class EventPlaceTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
