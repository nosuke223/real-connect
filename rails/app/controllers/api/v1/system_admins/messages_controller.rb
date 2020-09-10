# frozen_string_literal: true

class Api::V1::SystemAdmins::MessagesController < Api::V1::SystemAdmins::BaseController
  before_action :set_message, only: %i[show edit update destroy]

  # GET /message
  def index
    messages = Message.all.order(updated_at: 'desc')
    render json: messages.as_json(
      include: %i[event]
    )
  end

  # GET /messages/:id
  def show
    render json: @message.as_json(
      include: %i[event]
    )
  end

  # POST /messages
  def create
    @message = Message.new(message_params)
    if @message.save
      render json: @message.as_json(
        include: %i[event sender partner]
      )
    else
      render_valid_error(@message.errors.full_messages)
    end
  end

  # PATCH/PUT /messages/1
  def update
    if @message.update(message_params)
      render json: @message.as_json(
        include: %i[event sender partner]
      )
    else
      render_valid_error(@message.errors.full_messages)
    end
  end

  # DELETE /messages/1
  # DELETE /messages/1.json
  def destroy
    @message.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_message
    @message = Message.find(params[:id])
  end

  # Strong Parameter
  def message_params
    columns = Message.column_symbolized_names
    params.require(:message).permit(*columns)
  end
end
