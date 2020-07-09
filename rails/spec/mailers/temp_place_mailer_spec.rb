# frozen_string_literal: true

require 'rails_helper'

RSpec.describe TempPlaceMailer, type: :mailer do
  before do
    @temp_place = FactoryBot.create(:temp_place)
  end

  describe '#send_approve' do
    subject(:mail) do
      described_class.send_approve(@temp_place).deliver_now
      ActionMailer::Base.deliveries.last
    end
    context 'when send_approve' do
      it { expect(mail.to.first).to eq(@temp_place.application_email) }
      it { expect(mail.subject).to eq('申請を承認しました。') }
    end
  end

  describe '#send_reject_application' do
    subject(:mail) do
      described_class.send_reject_application(@temp_place).deliver_now
      ActionMailer::Base.deliveries.last
    end
    context 'when send_reject_application' do
      it { expect(mail.to.first).to eq(@temp_place.application_email) }
      it { expect(mail.subject).to eq('申請を却下しました。') }
    end
  end
end
