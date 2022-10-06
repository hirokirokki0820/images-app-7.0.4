class PostsController < ApplicationController
  before_action :set_post, only: [:destroy]

  def index
    @posts = Post.all
  end

  def new
    @post = Post.new
  end

  def create
    @post = Post.new(post_params)
    if @post.save
      flash[:notice] = "投稿しました"
      redirect_to posts_path
    else
      render "new", status: :unprocessable_entity
    end
  end

  def destroy
    @post.destroy
    flash[:notice] = "削除しました"
    redirect_to posts_path
  end

  private

  def post_params
    params.require(:post).permit(:title, images: [])
  end

  def set_post
    @post = Post.find(params[:id])
  end
end
