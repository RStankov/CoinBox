Rails.application.routes.draw do
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: '/graphiql', graphql_path: '/graphql'
  end

  post '/graphql', to: 'graphql#execute'

  devise_for :users, only: :sessions, path: 'sign', path_names: { sign_in: 'in', sign_out: 'out' }

  resource :user, only: %i(edit update)

  resources :games
  resources :game_api_keys, only: %i(new create edit update destroy)
  resources :consumables, only: %i(new create edit update destroy)
  resources :transferables, only: %i(new create edit update destroy)

  root to: 'dashboard#index'
end
