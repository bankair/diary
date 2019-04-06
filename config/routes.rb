Rails.application.routes.draw do
  resources :diary, only: %i(index show)
end
