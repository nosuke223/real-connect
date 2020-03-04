ActiveAdmin.register PlaceUser do
  menu parent: I18n.t('active_admin.parent.user_management'), priority: 3

  permit_params :place_id,
    :user_id

  index do
    selectable_column

    id_column

    column :place
    column :user
    column :created_at

    actions
  end

  show do |place_user|
    attributes_table do
      row :place
      row :user
      row :created_at
      row :updated_at
    end
  end

  form do |f|
    f.semantic_errors(*f.object.errors.keys)

    f.inputs I18n.t('activerecord.models.event') do
      f.input :place_id
      f.input :user_id
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
