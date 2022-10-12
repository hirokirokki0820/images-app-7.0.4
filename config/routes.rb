Rails.application.routes.draw do
  root "home#top"

  # 画像のアップロード
  post "posts/upload_image", to: "posts#upload_image"

  devise_for :users, controllers: {
    registrations: "users/registrations",
    sessions: "users/sessions",
    passwords: "users/passwords"
  }
  devise_scope :user do
    post "users/guest_sign_in", to: "users/sessions#guest_sign_in"
  end
  resources :posts
end
