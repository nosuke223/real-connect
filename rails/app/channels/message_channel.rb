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
      if current_user.area_id
        area = Area.find(current_user.area_id)
        stream_for area
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
    current_user.event_checkin(event, data['user_status_id'])
    stream_for event

    MessageChannel.broadcast_to(event, { type: 'event_checkedin_user', event_id: event.id, user: current_user, place_id: event.organize_place_id })

    # 男女比等の表示が変わるためエリア内にいるユーザのデータを更新
    area = Area.find(current_user.area_id)
    MessageChannel.broadcast_to(area, { type: 'reload_data' })
  end

  #
  # 会場移動
  #
  def checkin_place(data)
    current_user = find_user_by_jwt(data['token'])
    current_user.place_checkin(data['place_id'])
    
    area = Area.find(current_user.area_id)
    MessageChannel.broadcast_to(area, { type: 'place_checkedin_user', user_id: current_user.id, place_id: data['place_id'] })

    # 男女比等の表示が変わるためエリア内にいるユーザのデータを更新
    MessageChannel.broadcast_to(area, { type: 'reload_data' })
  end

  #
  # 会場およびイベントからチェックアウト
  #
  def checkout_event_and_place(data)
    current_user = find_user_by_jwt(data['token'])
    events = current_user.events.now(current_user.area_id)

    current_user.checkout()

    events.each do |event|
      MessageChannel.broadcast_to(event, { type: 'checkout_user', user_id: current_user.id })
    end

    # 男女比等の表示が変わるためエリア内にいるユーザのデータを更新
    area = Area.find(current_user.area_id)
    MessageChannel.broadcast_to(area, { type: 'reload_data' })
  end

  #
  # エリア移動
  #
  def change_area(data)
    current_user = find_user_by_jwt(data['token'])

    # チェックインしている店舗やイベントがあればチェックアウトする
    events = current_user.events.now(current_user.area_id)
    current_user.checkout()
    events.each do |event|
      MessageChannel.broadcast_to(event, { type: 'checkout_user', user_id: current_user.id })
    end

    # 移動前のエリアにいるユーザのデータを更新
    area = Area.find(current_user.area_id)
    MessageChannel.broadcast_to(area, { type: 'reload_data' })

    current_user.update_attribute(:area_id, data['area_id'])
  end

  private

  def find_user_by_jwt(token)
    payload = Warden::JWTAuth::TokenDecoder.new.call(token.gsub('Bearer ', ''))
    User.find_for_jwt_authentication(payload['sub'])
  end
end
