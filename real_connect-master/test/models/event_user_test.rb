# == Schema Information
#
# Table name: event_users
#
#  id             :bigint(8)        not null, primary key
#  event_id       :integer
#  user_id        :integer
#  checked_out_at :datetime
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  deleted_at     :datetime
#

require 'test_helper'

class EventUserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
