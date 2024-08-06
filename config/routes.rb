Rails.application.routes.draw do
  root "categories#new"
  resources :categories, only: [:new]
  get "/category/:id", to: "categories#search"
end
