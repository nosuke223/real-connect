# frozen_string_literal: true

Rails.application.routes.draw do
  ActiveAdmin.routes(self)
  devise_for :users, ActiveAdmin::Devise.config
  devise_for :users, skip: :all

  mount ActionCable.server => '/cable'

  devise_scope :user do
    resource :registration,
             defaults: { format: :json },
             only: %i[create destroy],
             path: 'api/v1/registrations',
             controller: 'api/v1/registrations'

    resource :sessions,
             defaults: { format: :json },
             only: %i[create destroy],
             path: 'api/v1/sessions',
             controller: 'api/v1/sessions'

    resource :passwords,
             defaults: { format: :json },
             only: %i[create update],
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

      resources :events, only: %i[index create] do
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

      resources :regions, only: %i[index]
      #
      # 店舗管理者用のAPI
      #
      namespace :owners do
        resources :users, only: %i[index] do
          collection do
            get :collection
          end
        end
        resources :events, only: %i[index create]
        resources :places, only: %i[index show update]
        resources :event_statuses, only: %i[index]
        resources :areas, only: %i[index] do
          collection do
            get :candidate_areas
          end
        end
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
        resources :messages, only: %i[index show create update destroy]
        resources :areas, only: %i[index show create update destroy]
        resources :places, only: %i[index show create update destroy]
        resources :temp_areas, only: %i[index show create update destroy] do
          collection do
            post :approval
          end
          member do
            delete :reject_application
          end
        end
        resources :temp_places, only: %i[index show create update destroy] do
          collection do
            post :approval
          end
          member do
            delete :reject_application
          end
        end
        resources :events, only: %i[index show create update destroy] do
          member do
            get :detail_with_messages
          end
        end
        resources :event_statuses, only: %i[index show create update destroy]
        resources :user_statuses, only: %i[index show create update destroy]
        resources :system_bbs_infos, only: %i[index show create update destroy]
        resources :system_bbs_news, only: %i[index show create update destroy]
        resources :prefectures, only: [:index]
      end
    end
  end

  get '/confirmations', to: 'confirmations#show'
  get '/passwords/reset', to: 'passwords#reset'

  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?
end
