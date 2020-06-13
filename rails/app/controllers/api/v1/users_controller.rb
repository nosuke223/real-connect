class Api::V1::UsersController < Api::BaseController
  #
  # ユーザーの情報を返す
  #
  # GET /api/v1/users
  #
  def show
    render json: current_user, serializer: CurrentUserSerializer
  end

  #
  # アカウント情報を更新する
  #
  # PATCH /api/v1/users
  #
  def update
    current_user.update!(user_update_params)
    render json: current_user, serializer: CurrentUserSerializer
  end

  #
  # 確認メールを再送信する
  #
  # POST /api/v1/users/confirmation_resend
  #
  def confirmation_resend
    current_user.resend_confirmation_instructions
    render_empty(:no_content)
  end

  #
  # 一般ユーザー一覧情報を返却する
  #
  # GET /api/v1/users/collection
  #
  def collection
    users = User.where(role: params[:role])
    render json: users.as_json(
      include: [:area]
    )
  end

  private

  def user_update_params
    params.permit(
      :email, :nickname, :avatar_image, :cover_image, :area_id, :height, :age, :prefecture, :area_id,
      :blood, :gender, :income, :education, :alcohol, :tobacco, :business, :birthplace,
      :birthplace, :attracted_type, :hobbies, :fashion, :password, :password_confirmation
    )
  end
end
