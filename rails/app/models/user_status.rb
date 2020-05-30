# == Schema Information
#
# Table name: user_statuses
#
#  id         :bigint(8)        not null, primary key
#  name       :string           default(""), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class UserStatus < ApplicationRecord
    include CommonModule
    validates :name, presence: true
end
