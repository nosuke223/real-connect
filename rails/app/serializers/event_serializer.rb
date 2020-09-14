class EventSerializer < ActiveModel::Serializer
  attributes :id,
    :name,
    :start_time,
    :end_time,
    :is_checked_in,
    :male_count,
    :female_count,
    :organize_place_id

  attribute :check_in_code, if: :current_user_owner?

  def current_user_owner?
    current_user.owner?
  end

  def is_checked_in
    object.event_users.pluck(:user_id).include?(current_user.id)
  end
end
