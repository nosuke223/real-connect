ActiveAdmin.register Talk do
  menu priority: 7

  permit_params :event,
    :user,
    :partner,
    :last_read_at

  index do
    selectable_column

    id_column

    column :event
    column :user
    column :partner
    column :unread_count

    actions
  end

  show do |talk|
    attributes_table do
      row :event
      row :user
      row :partner
      row :unread_count

      row :messages do |talk|	
        talk.messages.map do |message|	
          link_to("#{message.sender.nickname}: #{message.body}", admin_message_path(message))	
        end.join('<br> ').html_safe	
      end

      row :created_at
      row :updated_at
    end
  end

  form do |f|
    f.semantic_errors(*f.object.errors.keys)

    f.inputs I18n.t('activerecord.models.event') do
      f.input :event_id
      f.input :user_id
      f.input :partner_id
      f.input :last_read_at
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
