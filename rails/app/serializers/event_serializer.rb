class EventSerializer < ActiveModel::Serializer
  attributes :id,
    :name,
    :start_time,
    :end_time,
    :is_checked_in,
    :male_count,
    :female_count,
    :organize_place_id,
    :capacity,
    :organizer_type_name,
    :event_status_id,
    :from,
    :to,
    :detail

  attribute :check_in_code, if: :current_user_owner?

  def current_user_owner?
    current_user.owner?
  end

  def organizer_type_name
    case object.organizer_type
    when 1000
      'ユーザー'
    when 2000
      'オーナー'
    when 3000
      'システム管理者'
    end
  end

  def is_checked_in
    object.event_users.pluck(:user_id).include?(current_user.id)
  end
end
