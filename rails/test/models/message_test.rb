# == Schema Information
#
# Table name: messages
#
#  id         :bigint(8)        not null, primary key
#  event_id   :integer          not null
#  sender_id  :integer          not null
#  partner_id :integer          not null
#  body       :string
#  image      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  deleted_at :datetime
#

require 'test_helper'

class MessageTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
