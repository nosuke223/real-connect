# == Schema Information
#
# Table name: event_statuses
#
#  id         :bigint(8)        not null, primary key
#  name       :string           default(""), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class EventStatus < ApplicationRecord
    include CommonModule
    validates :name, presence: true
end
