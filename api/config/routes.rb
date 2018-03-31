Rails.application.routes.draw do
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: '/graphiql', graphql_path: '/graphql'
  end

  post '/graphql', to: 'graphql#execute'

  devise_for :users, only: :sessions, path: 'sign', path_names: { sign_in: 'in', sign_out: 'out' }

  resource :user, only: %i(edit update)

  root to: 'dashboard#index'
end
