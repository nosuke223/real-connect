ActiveAdmin.register User do
  menu parent: I18n.t('active_admin.parent.user_management'), priority: 1

  permit_params :age,
    :alcohol,
    :attracted_type,
    :avatar_image,
    :birthplace,
    :blood,
    :business,
    :cover_image,
    :education,
    :email,
    :password,
    :fashion,
    :gender,
    :height,
    :hobbies,
    :income,
    :nickname,
    :role,
    :tobacco,
    :area_id,
    :prefecture,
    :events,
    :current_place_id,
    :last_place_id,
    :confirmed_at

  filter :email
  filter :nickname

  index do
    selectable_column

    id_column

    column :email
    column :nickname
    column :deleted?

    actions
  end

  show do |user|
    attributes_table do
      row :email
      row :nickname

      row :avatar_image do
        image_tag(user.avatar_image.url) if user.avatar_image?
      end

      row :cover_image do
        image_tag(user.cover_image.url) if user.cover_image?
      end

      row :area

      row :height
      row :age, &:age_i18n
      row :blood, &:blood_i18n
      row :gender, &:gender_i18n
      row :income, &:income_i18n
      row :education, &:education_i18n
      row :prefecture, &:prefecture_i18n

      row :alcohol
      row :tobacco
  
      row :business
      row :birthplace
      row :attracted_type
      row :hobbies
      row :fashion

      row :events do |user|	
        user.events.map do |event|	
          link_to(event.name, admin_event_path(event))	
        end.join('<br> ').html_safe	
      end

      row :confirmation_sent_at
      row :confirmed_at
      row :deleted?
      row :created_at
      row :updated_at
    end
  end

  form do |f|
    f.semantic_errors(*f.object.errors.keys)

    f.inputs I18n.t('activerecord.models.event') do
      f.input :email
      f.input :nickname
      f.input :avatar_image
      f.input :cover_image
      f.input :area
      f.input :height
      f.input :age, as: :select, collection: User.ages_i18n.invert
      f.input :blood, as: :select, collection: User.bloods_i18n.invert
      f.input :gender, as: :select, collection: User.genders_i18n.invert
      f.input :income, as: :select, collection: User.incomes_i18n.invert
      f.input :education, as: :select, collection: User.educations_i18n.invert
      f.input :prefecture, as: :select, collection: User.prefectures_i18n.invert
      f.input :alcohol
      f.input :tobacco
      f.input :business
      f.input :birthplace
      f.input :attracted_type
      f.input :current_place_id
      f.input :last_place_id
      f.input :hobbies
      f.input :fashion
      f.input :confirmed_at
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

    def scoped_collection
      User.user.with_deleted
    end
  end
end
