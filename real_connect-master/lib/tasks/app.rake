namespace :app do
  namespace :dev do
    task reset: %i[db:drop db:create db:migrate db:seed app:dev:sample]

    task admin: :environment do
      FactoryBot.create(:user, :admin)
    end

    task sample: :environment do
      owner = FactoryBot.create(:user, :owner)
      areas = FactoryBot.create_list(:area, 2)

      areas.each do |area|
        users = FactoryBot.create_list(:user, 5, area: area)
        places = FactoryBot.create_list(:place, 3, area: area, owner: owner)

        events = FactoryBot.create_list(:event, 3, area: area)
        events.each do |event|
          event.places << places
          event.users << users.shuffle.take(3)

          (0..10).each { |i|
            sender = event.users.sample
            partner = (event.users - [sender]).sample
            FactoryBot.create(:message, event: event, sender: sender, partner: partner)
          }
        end
      end
    end
  end
end
