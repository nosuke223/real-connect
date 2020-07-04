# frozen_string_literal: true

class TempAreaMailer < ApplicationMailer
  def send_approve(temp_area)
    @temp_area = temp_area
    mail(
      subject: '申請を承認しました。',
      to: @temp_area.application_email, &:text
    )
  end

  def send_reject_application(temp_area)
    @temp_area = temp_area
    mail(
      subject: '申請を却下しました。',
      to: @temp_area.application_email, &:text
    )
  end
end
