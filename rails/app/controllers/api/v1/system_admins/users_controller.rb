class Api::V1::SystemAdmins::UsersController < Api::V1::SystemAdmins::BaseController
  #
  # ユーザー一覧を返却する
  #
  # GET /api/v1/sytem_admins/system_admins/users
  #
  def index
    users = User.where(role: 1000)
    render json: users.as_json(
      include: [:area]
    )
  end

  private

  # Strong Parameter
  def user_params
    columns = User.column_symbolized_names
    params.require(:event_status).permit(*columns)
  end
  
end
