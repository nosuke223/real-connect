class Api::V1::Owners::UsersController < Api::V1::Owners::BaseController
  #
  # 店舗・場所にチェックインしたユーザー一覧を取得する
  #
  # GET /api/v1/owners/users
  #
  def index
    place = current_user.own_places.last
    place_users = search_place_user(place.id)

    render json: place_users,
           adapter: :json,
           meta: {
            total_count: place_users.total_count,
            total_pages: place_users.total_pages,
            current_page: place_users.current_page
          }
  end

  #
  # 店舗・場所にチェックインしたユーザー一覧を集計用データを取得
  #
  # GET /api/v1/owners/users/collection
  #
  def collection
    place = current_user.own_places.last
    place_users = search_place_user(place.id)

    # ラベル生成
    labels = case params[:range]
      when 'daily'
        (Date.parse(params[:start_at])..Date.parse(params[:end_at]))
          .map {|date|
            date.strftime('%Y-%m-%d')
          }
      when 'monthly'
        (Date.parse(params[:start_at])..Date.parse(params[:end_at]))
          .map {|date|
            date.strftime('%Y-%m')
          }.uniq!
    end    

    # データ作成
    range_scope = case params[:range]
      when 'daily'
        lambda { |user|
          user.created_at.beginning_of_day.strftime('%Y-%m-%d')
        }
      when 'monthly'
        lambda { |user|
          user.created_at.beginning_of_month.strftime('%Y-%m')
        }
    end

    # 性別 別データを作成
    gender_group = place_users
      .group_by { |pu|
        pu.user.gender
      }
    
    data =  ['male', 'female'].map { |gender|
      v = {}
      v = gender_group[gender]
        .group_by { |u|
          range_scope.call(u)
        }
        .map { |k, group|
          [k, group.count]
        }.to_h if gender_group[gender].present?

      [gender, v]
    }.to_h

    # 男性カウント
    male_data = labels.map { |key|
      data['male'][key].present? ? data['male'][key] : 0 
    }

    # 女性カウント
    female_data = labels.map { |key|
      data['female'][key].present? ? data['female'][key] : 0 
    }

    # 年齢別データ
    age_group = place_users
      .uniq {|pu| pu.user_id }
      .group_by { |pu|
        pu.age
      }
    
    age_data = ['early_twenty', 'late_twenty', 'thirty', 'fourty', 'fifty'].map { |age|
      age_group[age].present? ? age_group[age].count : 0
    }
    render json: { labels: labels, data: { male: male_data, female: female_data, age_data: age_data } }
  end

  private

  #
  # 指定された条件でチェックインユーザーを検索
  #
  def search_place_user(place_id)
    PlaceUser.ransack(
      place_id_eq: place_id,
      age_eq_any: params[:age],
      user_gender_eq_any: params[:gender],
      created_at_gteq: params[:start_at],
      created_at_lteq: params[:end_at],
    ).result(distinct: true).eager_load(:user).latest.page(params[:page]).per(20)
  end
end
