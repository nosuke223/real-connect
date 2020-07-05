# frozen_string_literal: true

require 'rails_helper'
require 'date'

RSpec.describe Api::V1::SystemAdmins::SystemBbsInfosController, type: :request do
  before do
    @user = FactoryBot.create(:user, :admin)
    @system_bbs_info = FactoryBot.create(:system_bbs_info)
  end

  describe 'GET #index' do
    context '未認証' do
      it '400エラーを返す' do
        get api_v1_system_admins_system_bbs_infos_path
        expect(response).to have_http_status(400)
      end
    end

    context 'ログイン後' do
      before do
        login_as(@user)
      end
      it '200OKを返す' do
        get api_v1_system_admins_system_bbs_infos_path
        expect(response).to have_http_status(200)
      end
    end
  end

  describe 'GET #show' do
    context '未認証' do
      it '400エラーを返す' do
        get api_v1_system_admins_system_bbs_info_path({ id: @system_bbs_info.id })
        expect(response).to have_http_status(400)
      end
    end

    context 'ログイン後' do
      before do
        login_as(@user)
      end
      it '200OKを返す' do
        get api_v1_system_admins_system_bbs_info_path({ id: @system_bbs_info.id })
        expect(response).to have_http_status(200)
      end
    end
  end

  describe '#create' do
    before do
      @ok_params = {
        system_bbs_info: {
          detail: 'test',
          display_flag: true,
          display_date: Date.today
        }
      }
    end
    context '未認証' do
      it '400エラーを返す' do
        post api_v1_system_admins_system_bbs_infos_path(@ok_params)
        expect(response).to have_http_status(400)
      end
    end

    context 'ログイン後' do
      before do
        login_as(@user)
      end

      it '正常に作成し、200を返す' do
        post api_v1_system_admins_system_bbs_infos_path(@ok_params)
        expect(response).to have_http_status(200)
      end

      it '作成に失敗し、400を返す(detailが空)' do
        empty_params = {
          system_bbs_info: {
            detail: '',
            display_flag: true,
            display_date: Date.today
          }
        }
        post api_v1_system_admins_system_bbs_infos_path(empty_params)
        expect(response).to have_http_status(400)
      end

      it '作成に失敗し、400を返す(display_dateが空)' do
        empty_params = {
          system_bbs_info: {
            detail: '詳細',
            display_flag: true,
            display_date: ''
          }
        }
        post api_v1_system_admins_system_bbs_infos_path(empty_params)
        expect(response).to have_http_status(400)
      end
    end
  end

  describe '#update' do
    before do
      @ok_params = {
        system_bbs_info: {
          detail: 'test2',
          display_flag: true,
          display_date: Date.today
        },
        id: @system_bbs_info.id
      }
    end
    context '未認証' do
      it '400エラーを返す' do
        put api_v1_system_admins_system_bbs_info_path(@ok_params)
        expect(response).to have_http_status(400)
      end
    end

    context 'ログイン後' do
      before do
        login_as(@user)
      end

      it '正常に更新して200を返す' do
        put api_v1_system_admins_system_bbs_info_path(@ok_params)
        expect(response).to have_http_status(200)
      end

      it '失敗（detailの指定がない)' do
        empty_params = {
          system_bbs_info: {
            detail: '',
            display_flag: true,
            display_date: Date.today
          },
          id: @system_bbs_info.id
        }
        put api_v1_system_admins_system_bbs_info_path(empty_params)
        expect(response).to have_http_status(400)
      end

      it '失敗（display_dateの指定がない)' do
        empty_params = {
          system_bbs_info: {
            detail: '更新失敗',
            display_flag: true,
            display_date: ''
          },
          id: @system_bbs_info.id
        }
        put api_v1_system_admins_system_bbs_info_path(empty_params)
        expect(response).to have_http_status(400)
      end
    end
  end

  describe '#destroy' do
    context '未認証' do
      it '400エラーを返す' do
        delete api_v1_system_admins_system_bbs_info_path({ id: @system_bbs_info.id })
        expect(response).to have_http_status(400)
      end
    end
    context 'ログイン後' do
      before do
        login_as(@user)
      end

      it '正常に削除して200を返す' do
        delete api_v1_system_admins_system_bbs_info_path({ id: @system_bbs_info.id })
        expect(response).to have_http_status(204)
      end
    end
  end
end
