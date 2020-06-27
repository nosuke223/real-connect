# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::SystemAdmins::UserStatusesController, type: :request do
  before do
    @user = FactoryBot.create(:user, :admin)
    @user_status = FactoryBot.create(:user_status)
  end

  describe 'GET #index' do
    context '未認証' do
      it '400エラーを返す' do
        get api_v1_system_admins_user_statuses_path
        expect(response).to have_http_status(400)
      end
    end

    context 'ログイン後' do
      before do
        login_as(@user)
      end
      it '200OKを返す' do
        get api_v1_system_admins_user_statuses_path
        expect(response).to have_http_status(200)
      end
    end
  end

  describe 'GET #show' do
    context '未認証' do
      it '400エラーを返す' do
        get api_v1_system_admins_user_status_path({ id: @user_status.id })
        expect(response).to have_http_status(400)
      end
    end

    context 'ログイン後' do
      before do
        login_as(@user)
      end
      it '200OKを返す' do
        get api_v1_system_admins_user_status_path({ id: @user_status.id })
        expect(response).to have_http_status(200)
      end
    end
  end

  describe '#create' do
    before do
      @ok_params = {
        user_status: {
          name: 'test'
        }
      }
    end
    context '未認証' do
      it '400エラーを返す' do
        post api_v1_system_admins_user_statuses_path(@ok_params)
        expect(response).to have_http_status(400)
      end
    end

    context 'ログイン後' do
      before do
        login_as(@user)
      end

      it '正常に作成し、200を返す' do
        post api_v1_system_admins_user_statuses_path(@ok_params)
        expect(response).to have_http_status(200)
      end

      it '作成に失敗し、400を返す' do
        empty_params = {
          user_status: {
            name: ''
          }
        }
        post api_v1_system_admins_user_statuses_path(empty_params)
        expect(response).to have_http_status(400)
      end
    end
  end

  describe '#update' do
    before do
      @ok_params = {
        user_status: {
          name: 'test2'
        },
        id: @user_status.id
      }
    end
    context '未認証' do
      it '400エラーを返す' do
        put api_v1_system_admins_user_status_path(@ok_params)
        expect(response).to have_http_status(400)
      end
    end

    context 'ログイン後' do
      before do
        login_as(@user)
      end

      it '正常に更新して200を返す' do
        put api_v1_system_admins_user_status_path(@ok_params)
        expect(response).to have_http_status(200)
      end

      it '失敗（名前の指定がない)' do
        empty_params = {
          user_status: {
            name: ''
          },
          id: @user_status.id
        }
        put api_v1_system_admins_user_status_path(empty_params)
        expect(response).to have_http_status(400)
      end
    end
  end

  describe '#destroy' do
    context '未認証' do
      it '400エラーを返す' do
        delete api_v1_system_admins_user_status_path({ id: @user_status.id })
        expect(response).to have_http_status(400)
      end
    end
    context 'ログイン後' do
      before do
        login_as(@user)
      end

      it '正常に削除して200を返す' do
        delete api_v1_system_admins_user_status_path({ id: @user_status.id })
        expect(response).to have_http_status(204)
      end
    end
  end
end
