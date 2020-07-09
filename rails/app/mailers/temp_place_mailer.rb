# frozen_string_literal: true

class TempPlaceMailer < ApplicationMailer
  def send_approve(temp_place)
    @temp_place = temp_place
    mail(
      subject: '申請を承認しました。',
      to: @temp_place.application_email, &:text
    )
    end

  def send_reject_application(temp_place)
    @temp_place = temp_place
    mail(
      subject: '申請を却下しました。',
      to: @temp_place.application_email, &:text
    )
  end
end
