class MessageChannel < ApplicationCable::Channel
  #
  # チャンネルの購読開始
  #
   def subscribed
    current_user = find_user_by_jwt(params[:token])

    if current_user
      stream_from "message_channel"
      stream_for current_user
      current_user.events.now(current_user.area_id).each do |event|
        stream_for event
      end
    end
  end

  #
  # メッセージを作成
  #
  def create_message(data)
    current_user = find_user_by_jwt(data['token'])
    partner_user = User.find(data['partner_id'])

    Message.create(
      {
        event_id: data['event_id'],
        partner_id: data['partner_id'],
        body: data['body'],
        sender_nickname: data['sender_nickname'],
        partner_nickname: data['partner_nickname']
      }.merge!(
        sender: current_user
      )
    )
 
    MessageChannel.broadcast_to(current_user, { type: 'message', event_id: data['event_id'], partner_id: partner_user.id, message: data['body'] })
    MessageChannel.broadcast_to(partner_user, { type: 'message', event_id: data['event_id'], partner_id: current_user.id, message: data['body'] })
  end

  #
  # イベントチェックイン
  #
  def checkin_event(data)
    current_user = find_user_by_jwt(data['token'])
 
    event = Event.find(data['event_id'])
    # current_user.event_checkin(event, data['code'])
    current_user.event_checkin(event)
    stream_for event

    current_user.place_checkin(data['place_id'])

    MessageChannel.broadcast_to(event, { type: 'event_checkedin_user', event_id: event.id, user: current_user, place_id: data['place_id'] })
  end

  #
  # 会場移動
  #
  def checkin_place(data)
    current_user = find_user_by_jwt(data['token'])
    current_user.place_checkin(data['place_id'])
    
    current_user.events.now(current_user.area_id).each do |event|
      MessageChannel.broadcast_to(event, { type: 'place_checkedin_user', user_id: current_user.id, place_id: data['place_id'] })
    end
  end

  #
  # 会場移動
  #
  def change_area(data)
    current_user = find_user_by_jwt(data['token'])
    current_user.update_attribute(:area_id, data['area_id'])
  end

  private

  def find_user_by_jwt(token)
    payload = Warden::JWTAuth::TokenDecoder.new.call(token.gsub('Bearer ', ''))
    User.find_for_jwt_authentication(payload['sub'])
  end
end
