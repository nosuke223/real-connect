Rails.application.routes.draw do
  ActiveAdmin.routes(self)
  devise_for :users, ActiveAdmin::Devise.config
  devise_for :users, skip: :all

  mount ActionCable.server => '/cable'
  
  devise_scope :user do
    resource :registration,
      defaults: { format: :json },
      only: %i(create destroy),
      path: 'api/v1/registrations',
      controller: 'api/v1/registrations'

    resource :sessions,
      defaults: { format: :json },
      only: %i[create destroy],
      path: 'api/v1/sessions',
      controller: 'api/v1/sessions'

    resource :passwords,
      defaults: { format: :json },
      only: %i(create update),
      path: 'api/v1/passwords',
      controller: 'api/v1/passwords'
  end

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resource :users, only: %i[show update] do
        collection do
          post :confirmation_resend
        end
      end

      resources :events, only: %i[index] do
        member do
          get :users
          get :talks
          post :checkin
        end

        collection do
          get :past
        end
      end
      
      resources :places, only: %i[index] do
        member do
          post :checkin
        end
      end

      resource :messages, only: %i[show create]

      resources :prefectures, only: [:index]

      resources :areas, only: %i[index show create update destroy] do
      end

      resources :talks, only: %i[] do
        member do
          put :read
        end
      end

      resources :event_statuses, only: %i[index show create update destroy]

      resources :user_statuses, only: %i[index show create update destroy]

      #
      # 店舗管理者用のAPI
      #
      namespace :owners do
        resources :users, only: %i[index] do
          collection do
            get :collection
          end
        end
        resources :events, only: %i[index]
        resources :places, only: %i[update]
      end

      #
      # システム管理者用のAPI
      #
      namespace :system_admins do
        resources :users, only: %i[index show create update destroy] do
          collection do 
            get :selections
          end
        end
        resources :areas, only: %i[index show create update destroy]
        resources :event_statuses, only: %i[index show create update destroy]
        resources :user_statuses, only: %i[index show create update destroy]
        resources :prefectures, only: [:index]
      end

    end
  end

  get '/confirmations', to: 'confirmations#show'
  get '/passwords/reset', to: 'passwords#reset'

  if Rails.env.development?
    mount LetterOpenerWeb::Engine, at: "/letter_opener"
  end
end
