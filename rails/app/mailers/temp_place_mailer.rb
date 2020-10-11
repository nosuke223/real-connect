# frozen_string_literal: true

class TempPlaceMailer < ApplicationMailer
  def send_approve(temp_place)
    @temp_place = temp_place
    mail(
      subject: 'りあこね新規店舗登録　承認ご通知',
      to: @temp_place.application_email, &:text
    )
    end

  def send_reject_application(temp_place)
    @temp_place = temp_place
    mail(
      subject: 'りあこね新規店舗登録について',
      to: @temp_place.application_email, &:text
    )
  end
end
