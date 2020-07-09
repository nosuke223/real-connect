# frozen_string_literal: true

class Api::V1::SystemAdmins::TempPlacesController < Api::V1::SystemAdmins::BaseController
  before_action :set_temp_place, only: %i[show update destroy approval reject_application]

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
      id created_at updated_at deleted_at application_email application_comment application_status
    ]
    attributes = @temp_place.attributes
    attributes['seat_status'] = 'open'
    no_reuired_colomuns.each do |column|
      attributes.delete(column)
    end
    user_columns = {
      email: @temp_place.application_email,
      password: @temp_place.application_email
    }
    Place.transaction do
      Place.create!(attributes)
      User.transaction do
        User.new(user_columns).save!(validate: false) unless User.with_deleted.find_by(email: user_columns.dig(:email))
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
  end

  def reject_application
    SystemBbsInfo.transaction do
      SystemBbsInfo.create!(
        {
          detail: "店舗：#{@temp_place.name}が承認されませんでした",
          display_flag: true,
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
