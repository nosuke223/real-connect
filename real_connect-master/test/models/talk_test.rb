# == Schema Information
#
# Table name: talks
#
#  id              :bigint(8)        not null, primary key
#  user_id         :integer          not null
#  partner_id      :string           not null
#  event_id        :string           not null
#  last_message_id :integer
#  last_read_at    :datetime
#  deleted_at      :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

require 'test_helper'

class TalkTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
