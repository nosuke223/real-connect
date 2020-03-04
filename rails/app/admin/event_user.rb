ActiveAdmin.register EventUser do
  menu parent: I18n.t('active_admin.parent.user_management'), priority: 2

  permit_params :event_id,
    :user_id,
    :checked_out_at

  index do
    selectable_column

    id_column

    column :event
    column :user
    column :created_at
    column :checked_out_at

    actions
  end

  show do |event_user|
    attributes_table do
      row :event
      row :user
      row :created_at
      row :checked_out_at
      row :updated_at
    end
  end

  form do |f|
    f.semantic_errors(*f.object.errors.keys)

    f.inputs I18n.t('activerecord.models.event') do
      f.input :event_id
      f.input :user_id
      f.input :checked_out_at
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
