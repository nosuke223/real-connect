ActiveAdmin.register User, as: 'OwnerUser' do
  menu priority: 9

  permit_params :email,
    :nickname,
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

    column :own_places do |owner|
      owner.own_places.map do |place|
        link_to(place.name, admin_place_path(place))
      end.join('<br> ').html_safe
    end

    actions
  end

  show do |user|
    attributes_table do
      row :email
      row :nickname
      row :own_places do |owner|
        owner.own_places.map do |place|
          link_to(place.name, admin_place_path(place))
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
    f.object.role = :owner
    f.inputs I18n.t('activerecord.models.owner_user') do
      f.input :email
      f.input :password
      f.input :password_confirmation
      f.input :nickname
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
      User.owner.with_deleted
    end
  end
end
