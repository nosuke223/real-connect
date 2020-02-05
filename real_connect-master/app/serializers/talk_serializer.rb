class TalkSerializer < ActiveModel::Serializer
  attributes :id,
  :event_id,
  :unread_count

  belongs_to :partner, serializer: UserSerializer
  belongs_to :last_message, serializer: MessageSerializer
end
