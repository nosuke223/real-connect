# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::SystemAdmins::TempPlacesController, type: :request do
  before do
    @user = FactoryBot.create(:user, :admin)
    @temp_place = FactoryBot.create(:temp_place)
    @ok_params = {
      temp_place: {
        "owner_id": 2,
        "name": 'success店舗',
        "area_id": 1,
        "address1": '北海道',
        "telephone": '0123456',
        "url": 'http://example.com',
        "logo_image": '88f2d4a0-dd3f-448f-9562-ca5f5b7ef530.png',
        "cover_image": '606d1e29-7f83-482c-9939-439769a118b6.png',
        "store_type": nil,
        "description": 'ここは店舗の説明です！',
        "note": '※営業時間は変動する可能性があります',
        "seat_status": 0,
        "sun_start_at": nil,
        "sun_end_at": nil,
        "is_sun_holiday": false,
        "mon_start_at": '2000-01-02T02:00:00.000+09:00',
        "mon_end_at": '2000-01-02T07:00:00.000+09:00',
        "is_mon_holiday": true,
        "tue_start_at": nil,
        "tue_end_at": nil,
        "is_tue_holiday": false,
        "wed_start_at": nil,
        "wed_end_at": nil,
        "is_wed_holiday": true,
        "thu_start_at": nil,
        "thu_end_at": nil,
        "is_thu_holiday": false,
        "fri_start_at": nil,
        "fri_end_at": nil,
        "is_fri_holiday": false,
        "sat_start_at": nil,
        "sat_end_at": nil,
        "is_sat_holiday": false,
        "deleted_at": nil,
        "place_users_count": 2,
        "zipcode": '339-1066',
        "address2": '潮村',
        "address3": '546 高岡Square',
        "payment_flag": nil,
        "last_payment_at": nil,
        "application_comment": 'testで申請いたします',
        "application_status": nil,
        "application_email": 'testbae@example.com'
      }
    }
  end

  describe 'GET #index' do
    context '未認証' do
      it '400エラーを返す' do
        get api_v1_system_admins_temp_places_path
        expect(response).to have_http_status(400)
      end
    end

    context 'ログイン後' do
      before do
        login_as(@user)
      end
      it '200OKを返す' do
        get api_v1_system_admins_temp_places_path
        expect(response).to have_http_status(200)
      end
    end
  end

  describe 'GET #show' do
    context '未認証' do
      it '400エラーを返す' do
        get api_v1_system_admins_temp_place_path({ id: @temp_place.id })
        expect(response).to have_http_status(400)
      end
    end

    context 'ログイン後' do
      before do
        login_as(@user)
      end
      it '200OKを返す' do
        get api_v1_system_admins_temp_place_path({ id: @temp_place.id })
        expect(response).to have_http_status(200)
      end
    end
  end

  describe '#create' do
    context '未認証' do
      it '400エラーを返す' do
        post api_v1_system_admins_temp_places_path(@ok_params)
        expect(response).to have_http_status(400)
      end
    end

    context 'ログイン後' do
      before do
        login_as(@user)
      end

      it '正常に作成し、200を返す' do
        post api_v1_system_admins_temp_places_path(@ok_params)
        expect(response).to have_http_status(200)
      end

      it 'application_commentが空であるため、400を返す' do
        empty_params = @ok_params.dup
        empty_params[:temp_place][:application_comment] = ''
        post api_v1_system_admins_temp_places_path(empty_params)
        expect(response).to have_http_status(400)
      end

      it 'application_emailtが空であるため、400を返す' do
        empty_params = @ok_params.dup
        empty_params[:temp_place][:application_email] = ''
        post api_v1_system_admins_temp_places_path(empty_params)
        expect(response).to have_http_status(400)
      end
    end
  end

  describe '#update' do
    before do
      @update_ok_params = @ok_params.dup
      @update_ok_params[:id] = @temp_place.id
    end

    context '未認証' do
      it '400エラーを返す' do
        put api_v1_system_admins_temp_place_path(@update_ok_params)
        expect(response).to have_http_status(400)
      end
    end

    context 'ログイン後' do
      before do
        login_as(@user)
      end

      it '正常に更新して200を返す' do
        @update_ok_params[:temp_place][:application_comment] = '変更しました'
        put api_v1_system_admins_temp_place_path(@update_ok_params)
        expect(response).to have_http_status(200)
      end

      it 'application_commentが空であるため失敗する' do
        empty_params = @update_ok_params.dup
        empty_params[:temp_place][:application_comment] = ''
        put api_v1_system_admins_temp_place_path(empty_params)
        expect(response).to have_http_status(400)
      end

      it 'application_emailtが空であるため失敗する' do
        empty_params = @update_ok_params.dup
        empty_params[:temp_place][:application_email] = ''
        put api_v1_system_admins_temp_place_path(empty_params)
        expect(response).to have_http_status(400)
      end
    end
  end

  describe '#destroy' do
    context '未認証' do
      it '400エラーを返す' do
        delete api_v1_system_admins_temp_place_path({ id: @temp_place.id })
        expect(response).to have_http_status(400)
      end
    end
    context 'ログイン後' do
      before do
        login_as(@user)
      end

      it '正常に削除して200を返す' do
        delete api_v1_system_admins_temp_place_path({ id: @temp_place.id })
        expect(response).to have_http_status(204)
      end
    end
  end

  describe '#approval' do
    context '未認証' do
      it '400エラーを返す' do
        post approval_api_v1_system_admins_temp_places_path({ id: @temp_place.id })
        expect(response).to have_http_status(400)
      end
    end

    context do
      before do
        login_as(@user)
      end
      it '正常に削除して204を返す' do
        post approval_api_v1_system_admins_temp_places_path({ id: @temp_place.id })
      end
    end
  end
end
