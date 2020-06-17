class Api::V1::SystemAdmins::UsersController < Api::V1::SystemAdmins::BaseController

  before_action :set_user, only: [:show, :update, :destroy]
  skip_before_action :authenticate_system_admin!, only: [:create, :update]

  #
  # ユーザー一覧を返却する
  #
  # GET /api/v1/sytem_admins/users
  #
  def index
    users = User.where(role: params[:role]).order(updated_at: 'desc')
    render json: users.as_json(
      include: [:area, :own_places]
    )
  end
  # ユーザー詳細を返却する
  #
  # GET /api/v1/system_admins/users
  #
  def show
    render json: @user.as_json(
      include: [
        :area, :prefecture, :own_places
      ]
    ).merge(
      age_display: User.ages_i18n.dig(@user.age),
      blood_display: User.bloods_i18n.dig(@user.blood),
      gender_display: User.genders_i18n.dig(@user.gender),
      income_display: User.incomes_i18n.dig(@user.income),
      education_display: User.educations_i18n.dig(@user.education),
    )
  end

  # POST /api/v1/system_admins/users
  def create
    user = User.new(user_params)
    unless params[:password].blank?
      user.password = params[:password]
    end
    user.skip_reconfirmation!
    if user.save(validate: false)
      render json:user
    else
      render_empty(500)
    end
  end

  # PATCH/PUT /api/v1/system_admins//1
  def update
    @user.assign_attributes(user_params)
    # パスワードが空文字の場合更新しない
    unless params[:password].blank?
      @user.password = params[:password]
    end
    @user.skip_reconfirmation!
    if @user.save(validate: false)
      render json: @user
    else
      render_empty(500)
    end
  end

  # DELETE /api/v1/system_admins/user_statuses/1
  def destroy
    @user.destroy
  end

  # Userモデルのenum属性のカラムの選択値を返す
  #
  # Get /api/v1/system_admins/users/props

  def selections
    render json: User.get_selection_value.to_json
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  # Strong Parameter
  def user_params
    columns = User.column_symbolized_names
    columns.push(:password, :password_confirmation)
    params.require(:user).permit(*columns)
  end
  
end
