class PrefectureMaster
  class << self
    EXPIRES_IN = 1.hours.freeze
    PREFECTURE_KEY = 'PREFECTURE_KEY'.freeze
    PREFECTURES = [
      { title: '北海道', value: 'hokkaido' },
      { title: '青森県', value: 'aomori' },
      { title: '岩手県', value: 'iwate' },
      { title: '宮城県', value: 'miyagi' },
      { title: '秋田県', value: 'akita' },
      { title: '山形県', value: 'yamagata' },
      { title: '福島県', value: 'fukushima' },
      { title: '茨城県', value: 'ibaraki' },
      { title: '栃木県', value: 'tochigi' },
      { title: '群馬県', value: 'gunma' },
      { title: '埼玉県', value: 'saitama' },
      { title: '千葉県', value: 'chiba' },
      { title: '東京都', value: 'tokyo' },
      { title: '神奈川県', value: 'kanagawa' },
      { title: '新潟県', value: 'niigata' },
      { title: '富山県', value: 'toyama' },
      { title: '石川県', value: 'ishikawa' },
      { title: '福井県', value: 'fukui' },
      { title: '山梨県', value: 'yamanashi' },
      { title: '長野県', value: 'nagano' },
      { title: '岐阜県', value: 'gifu' },
      { title: '静岡県', value: 'shizuoka' },
      { title: '愛知県', value: 'aichi' },
      { title: '三重県', value: 'mie' },
      { title: '滋賀県', value: 'shiga' },
      { title: '京都府', value: 'kyoto' },
      { title: '大坂府', value: 'osaka' },
      { title: '兵庫県', value: 'hyogo' },
      { title: '奈良県', value: 'nara' },
      { title: '和歌山県', value: 'wakayama' },
      { title: '鳥取県', value: 'tottori' },
      { title: '島根県', value: 'shimane' },
      { title: '岡山県', value: 'okayama' },
      { title: '広島県', value: 'hiroshima' },
      { title: '山口県', value: 'yamaguchi' },
      { title: '徳島県', value: 'tokushima' },
      { title: '香川県', value: 'kagawa' },
      { title: '愛媛県', value: 'ehime' },
      { title: '高知県', value: 'kochi' },
      { title: '福岡県', value: 'fukuoka' },
      { title: '佐賀県', value: 'saga' },
      { title: '長崎県', value: 'nagasaki' },
      { title: '熊本県', value: 'kumamoto' },
      { title: '大分県', value: 'oita' },
      { title: '宮崎県', value: 'miyazaki' },
      { title: '鹿児島県', value: 'kagoshima' },
      { title: '沖縄県', value: 'okinawa' }
    ]

    #
    # 都道府県一覧
    #
    def all(force = false)
      Rails.cache.fetch(PREFECTURE_KEY, expires_in: EXPIRES_IN, force: force) {
        area_prefectures = Area.all.map {|a| a.prefecture }.uniq
        PREFECTURES.select {|p| area_prefectures.include?(p[:value]) }
      }
    end
  end
end
