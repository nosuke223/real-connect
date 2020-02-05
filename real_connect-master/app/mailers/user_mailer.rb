class UserMailer < Devise::Mailer
  #
  # 仮登録メール送信
  #
  def confirmation_on_create_instructions(record, token, opts = {})
    @token = token
    devise_mail(record, :confirmation_on_create_instructions, opts)
  end

  #
  # 本登録メール送信
  #
  def welcome_letter(record, opts = {})
    devise_mail(record, :welcome_letter, opts)
  end
end