namespace :import do
  desc "Import from csv"

  task regions: :environment do
    path = File.join Rails.root, "db/csv/regions.csv"
    puts "path: #{path}"
    list = []
    CSV.foreach(path, headers: true) do |row|
      list << {
          name: row["name"],
      }
    end
    puts "start to create region data"
    begin
      Region.create!(list)
      puts "completed!!"
    rescue ActiveModel::UnknownAttributeError => invalid
      puts "raised error : unKnown attribute "
    end
  end

  task prefectures: :environment do
    path = File.join Rails.root, "db/csv/prefectures.csv"
    puts "path: #{path}"
    list = []
    CSV.foreach(path, headers: true) do |row|
      list << {
          region_id: row["region_id"],
          code: row["code"],
          name: row["name"],
      }
    end
    puts "start to create prefecture data"
    begin
      Prefecture.create!(list)
      puts "completed!!"
    rescue ActiveModel::UnknownAttributeError => invalid
      puts "raised error : unKnown attribute "
    end
  end
end
