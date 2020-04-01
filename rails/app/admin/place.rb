ActiveAdmin.register Place do
  menu priority: 4

  permit_params :owner_id,
    :name,
    :area_id,
    :zipcode,
    :address1,
    :address2,
    :address3,
    :telephone,
    :url,
    :logo_image,
    :cover_image,
    :store_type,
    :description,
    :note,
    :seat_status,
    :sun_start_at,
    :sun_end_at,
    :is_sun_holiday,
    :mon_start_at,
    :mon_end_at,
    :is_mon_holiday,
    :tue_start_at,
    :tue_end_at,
    :is_tue_holiday,
    :wed_start_at,
    :wed_end_at,
    :is_wed_holiday,
    :thu_start_at,
    :thu_end_at,
    :is_thu_holiday,
    :fri_start_at,
    :fri_end_at,
    :is_fri_holiday,
    :sat_start_at,
    :sat_end_at,
    :is_sat_holiday

  index do
    selectable_column

    id_column

    column :name
    column :area
    column :owner
    column :created_at

    actions
  end

  show do |place|
    attributes_table do
      row :owner do
        link_to(place.owner.nickname, admin_owner_user_path(place.owner))
      end

      row :name
      row :area
      row :zipcode
      row :address1
      row :address2
      row :address3
      row :telephone
      row :url

      row :logo_image do
        image_tag(place.logo_image.url) if place.logo_image?
      end

      row :cover_image do
        image_tag(place.cover_image.url) if place.cover_image?
      end

      row :store_type
      row :description
      row :note
      row :seat_status, &:seat_status_i18n
      row :sun_start_at
      row :sun_end_at
      row :is_sun_holiday
      row :mon_start_at
      row :mon_end_at
      row :is_mon_holiday
      row :tue_start_at
      row :tue_end_at
      row :is_tue_holiday
      row :wed_start_at
      row :wed_end_at
      row :is_wed_holiday
      row :thu_start_at
      row :thu_end_at
      row :is_thu_holiday
      row :fri_start_at
      row :fri_end_at
      row :is_fri_holiday
      row :sat_start_at
      row :sat_end_at
      row :is_sat_holiday

      row :created_at
      row :updated_at
    end
  end

  form do |f|
    f.semantic_errors(*f.object.errors.keys)

    f.inputs I18n.t('activerecord.models.place') do
      f.input :owner, as: :select, collection: User.owner.all.map { |e| ["#{e.email}（ID：#{e.id}）", e.id] }
      f.input :name
      f.input :area
      f.input :zipcode
      f.input :address1
      f.input :address2
      f.input :address3
      f.input :telephone
      f.input :url
      f.input :logo_image
      f.input :cover_image
      f.input :store_type
      f.input :description
      f.input :note
      f.input :seat_status, as: :select, collection: Place.seat_statuses_i18n.invert, include_blank: false
      f.input :sun_start_at
      f.input :sun_end_at
      f.input :is_sun_holiday
      f.input :mon_start_at
      f.input :mon_end_at
      f.input :is_mon_holiday
      f.input :tue_start_at
      f.input :tue_end_at
      f.input :is_tue_holiday
      f.input :wed_start_at
      f.input :wed_end_at
      f.input :is_wed_holiday
      f.input :thu_start_at
      f.input :thu_end_at
      f.input :is_thu_holiday
      f.input :fri_start_at
      f.input :fri_end_at
      f.input :is_fri_holiday
      f.input :sat_start_at
      f.input :sat_end_at
      f.input :is_sat_holiday
    end

    f.actions
  end

  controller do
    def index
      super
    end

    def show
      super
    end

    def new
      super
    end

    def create
      super
    end

    def edit
      super
    end

    def update
      super
    end

    def destroy
      super
    end
  end
end
