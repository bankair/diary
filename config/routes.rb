Rails.application.routes.draw do
  resources :diary, only: %i(index show) do
    resources :entry, only: %i(create)
  end
end
