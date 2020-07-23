# frozen_string_literal: true

class Api::V1::SystemAdmins::PrefecturesController < Api::V1::SystemAdmins::BaseController
  skip_before_action :authenticate_system_admin!, only: %i[index]
  #
  # 都道府県一覧を返す
  #
  # GET /api/v1/sytem_admins/prefectures
  #
  def index
    prefectures = Prefecture.all
    render json: prefectures
  end
end
