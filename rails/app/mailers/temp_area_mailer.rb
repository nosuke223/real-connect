# frozen_string_literal: true

class TempAreaMailer < ApplicationMailer
  def send_approve(temp_area)
    @temp_area = temp_area
    mail(
      subject: 'りあこね新規エリア登録　承認ご通知',
      to: @temp_area.application_email, &:text
    )
  end

  def send_reject_application(temp_area)
    @temp_area = temp_area
    mail(
      subject: 'りあこね新規エリア登録について',
      to: @temp_area.application_email, &:text
    )
  end
end
