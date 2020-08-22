# frozen_string_literal: true

class Api::V1::SystemAdmins::PlacesController < Api::V1::SystemAdmins::BaseController
  before_action :set_place, only: %i[show update destroy]
  skip_before_action :authenticate_system_admin!, only: %i[index]

  #
  # GET /api/v1/sytem_admins/places
  #
  def index
    render json: Place.all.as_json(
      include: [:owner]
    )
  end

  #
  # GET /api/v1/sytem_admins/places/:id
  #
  def show
    render json: @place.as_json(
      include: [:owner]
    )
  end

  # POST /placees
  def create
    @place = Place.new(place_params)
    if @place.save
      render json: @place.as_json
    else
      render_valid_error(@place.errors.full_messages)
    end
  end

  # PATCH/PUT /placees/1
  # PATCH/PUT /placees/1.json
  def update
    if @place.update(place_params)
      render json: @place.as_json
    else
      render_valid_error(@place.errors.full_messages)
    end
  end

  # DELETE /placees/1
  # DELETE /placees/1.json
  def destroy
    @place.destroy
  end

  private

  def set_place
    @place = Place.find(params[:id])
  end

  def place_params
    columns = Place.column_symbolized_names
    params.require(:place).permit(*columns)
  end
end
