ActiveAdmin.register Event do
  menu priority: 2

  permit_params :name,
    :check_in_code,
    :start_time,
    :end_time,
    :area_id

  filter :name
  filter :start_time
  filter :end_time

  index do
    selectable_column

    id_column

    column :name
    column :check_in_code
    column :start_time
    column :end_time
    column :male_count
    column :female_count
    column :created_at

    actions
  end

  show do |event|
    attributes_table do
      row :name
      row :area
      row :check_in_code
      row :start_time
      row :end_time
      row :male_count
      row :female_count

      row :users do |event|	
        event.users.map do |user|	
          link_to(user.nickname, admin_user_path(user))	
        end.join('<br> ').html_safe	
      end

      row :places do |event|	
        event.places.map do |place|	
          link_to(place.name, admin_place_path(place))	
        end.join('<br> ').html_safe	
      end

      row :created_at
      row :updated_at
    end
  end

  form do |f|
    f.semantic_errors(*f.object.errors.keys)

    f.inputs I18n.t('activerecord.models.event') do
      f.input :name
      f.input :check_in_code
      f.input :area
      f.input :start_time
      f.input :end_time
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
