ActiveAdmin.register EventPlace do
  menu priority: 3

  permit_params :event_id,
    :place_id

  filter :event_id
  filter :place

  index do
    selectable_column

    id_column

    column :event
    column :place
    column :created_at

    actions
  end

  show do |event_user|
    attributes_table do
      row :event
      row :place
      row :created_at
      row :updated_at
    end
  end

  form do |f|
    f.semantic_errors(*f.object.errors.keys)

    f.inputs I18n.t('activerecord.models.event') do
      f.input :event_id, as: :select, collection: Event.all.map { |e| ["#{e.name}（ID：#{e.id}）", e.id] }
      f.input :place_id, as: :select, collection: Place.all.map { |p| [p.name, p.id] }
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
