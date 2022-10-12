class Post < ApplicationRecord
  has_many_attached :images, dependent: :destroy

  validates :title, presence: true

end
