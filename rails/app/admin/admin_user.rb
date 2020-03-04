ActiveAdmin.register User, as: 'AdminUser' do
  menu priority: 10

  permit_params :email,
    :password,
    :password_confirmation,
    :confirmed_at

  filter :email

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
      row :confirmation_sent_at
      row :confirmed_at
      row :deleted?
      row :created_at
      row :updated_at
    end
  end

  form do |f|
    f.semantic_errors(*f.object.errors.keys)
    f.object.role = :admin
    f.inputs I18n.t('activerecord.models.admin_user') do
      f.input :email
      f.input :nickname
      f.input :password
      f.input :password_confirmation
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
      User.admin.with_deleted
    end
  end
end
