ActiveAdmin.register Area do
  menu priority: 5

  permit_params :name,
    :area,
    :prefecture

  filter :prefecture

  index do
    selectable_column

    id_column

    column :name
    column :prefecture, &:prefecture_i18n
    column :created_at
    column :updated_at

    actions
  end

  show do |area|
    attributes_table do
      row :name
      row :prefecture, &:prefecture_i18n
      row :created_at
      row :updated_at
    end
  end

  form do |f|
    f.semantic_errors(*f.object.errors.keys)

    f.inputs I18n.t('activerecord.models.area') do
      f.input :prefecture, as: :select, collection: Area.prefectures_i18n.invert, include_blank: false
      f.input :name
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
