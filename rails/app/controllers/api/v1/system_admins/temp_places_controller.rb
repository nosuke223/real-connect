# frozen_string_literal: true

class Api::V1::SystemAdmins::TempPlacesController < Api::V1::SystemAdmins::BaseController
  before_action :set_temp_place, only: %i[show update destroy approval reject_application]
  skip_before_action :authenticate_system_admin!, only: %i[create]

  #
  # GET /api/v1/sytem_admins/temp_places
  #
  def index
    render json: TempPlace.all.as_json
  end

  #
  # GET /api/v1/sytem_admins/temp_places/:id
  #
  def show
    render json: @temp_place.as_json(include: :area)
  end

  # POST /temp_placees
  def create
    @temp_place = TempPlace.new(temp_place_params)
    if @temp_place.save
      render json: @temp_place.as_json
    else
      render_valid_error(@temp_place.errors.full_messages)
    end
  end

  # PATCH/PUT /temp_placees/1
  # PATCH/PUT /temp_placees/1.json
  def update
    if @temp_place.update(temp_place_params)
      render json: @temp_place.as_json
    else
      render_valid_error(@temp_place.errors.full_messages)
    end
  end

  # DELETE /temp_placees/1
  # DELETE /temp_placees/1.json
  def destroy
    @temp_place.destroy
  end

  def approval
    no_reuired_colomuns = %w[
      id
      created_at
      updated_at
      deleted_at
      application_email
      application_comment
      application_status
      place_users_count
    ]
    attributes = @temp_place.attributes
    no_reuired_colomuns.each do |column|
      attributes.delete(column)
    end
    # 店舗必須入力値の仮埋め
    attributes[:is_sun_holiday] = false
    attributes[:is_mon_holiday] = false
    attributes[:is_tue_holiday] = false
    attributes[:is_wed_holiday] = false
    attributes[:is_thu_holiday] = false
    attributes[:is_fri_holiday] = false
    attributes[:is_sat_holiday] = false
    attributes[:place_users_count] = false
    attributes[:seat_status] = 'open'
    user_columns = {
      email: @temp_place.application_email,
      password: @temp_place.application_email
    }
    User.transaction do
      owner = User.with_deleted.find_by(email: user_columns.dig(:email))
      unless owner
        owner = User.new(user_columns)
        owner.save!(validate: false)
      end
      attributes['owner_id'] = owner.id
      Place.transaction do
        Place.create!(attributes)
      end
      SystemBbsInfo.transaction do
        SystemBbsInfo.create!(
          {
            detail: "店舗：#{@temp_place.name}が承認されました",
            display_flag: true,
            display_date: Date.today
          }
        )
        TempPlace.transaction do
          TempPlaceMailer.send_approve(@temp_place).deliver
          @temp_place.destroy!
        end
      end
    end
  end

  def reject_application
    SystemBbsInfo.transaction do
      SystemBbsInfo.create!(
        {
          detail: "店舗：#{@temp_place.name}が承認されませんでした",
          display_flag: false,
          display_date: Date.today
        }
      )
      TempPlace.transaction do
        TempPlaceMailer.send_reject_application(@temp_place).deliver
        @temp_place.destroy
      end
    end
  end

  private

  def set_temp_place
    @temp_place = TempPlace.find(params[:id])
  end

  def temp_place_params
    columns = TempPlace.column_symbolized_names
    params.require(:temp_place).permit(*columns)
  end
end
