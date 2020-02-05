ActiveAdmin.register Message do
  menu priority: 8

  permit_params :event_id,
    :body,
    :sender_id,
    :partner_id

  index do
    selectable_column

    id_column

    column :body
    column :sender
    column :partner

    actions
  end

  show do |message|
    attributes_table do
      row :body

      row :image do
        image_tag(message.image.url) if message.image?
      end

      row :sender
      row :partner

      row :created_at
      row :updated_at
    end
  end

  form do |f|
    f.semantic_errors(*f.object.errors.keys)

    f.inputs I18n.t('activerecord.models.event') do
      f.input :event_id
      f.input :sender_id
      f.input :partner_id
      f.input :body
      f.input :image
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
