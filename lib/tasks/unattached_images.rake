namespace :unattached_images do
  desc "紐付けされなかったアップロード(active_storage_blobs)を定期的に削除する"
  task purge: :environment do
    ActiveStorage::Blob.unattached.find_each(&:purge)
  end
end
