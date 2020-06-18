class Api::V1::SystemAdmins::UserStatusesController < Api::V1::SystemAdmins::BaseController
  before_action :set_user_status, only: [:show, :edit, :update, :destroy]

  # GET /user_statuses
  # GET /user_statuses.json
  def index
    user_statuses = UserStatus.all
    render json:user_statuses
  end

  # GET /user_statuses/1
  # GET /user_statuses/1.json
  def show
    render json:@user_status
  end

  # POST /user_statuses
  # POST /user_statuses.json
  def create
    @user_status = UserStatus.new(user_status_params)
    if @user_status.save
      render json:@user_status
    else
      render_valid_error(@user_status.errors.full_messages)
    end
  end

  # PATCH/PUT /user_statuses/1
  # PATCH/PUT /user_statuses/1.json
  def update
    if @user_status.update(user_status_params)
      render json: @user_status
    else
      render_valid_error(@user_status.errors.full_messages)
    end
  end

  # DELETE /user_statuses/1
  # DELETE /user_statuses/1.json
  def destroy
    @user_status.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_status
      @user_status = UserStatus.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_status_params
      columns = UserStatus.column_symbolized_names
      params.require(:user_status).permit(*columns)
    end
end
