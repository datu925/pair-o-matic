class SessionsController < ApplicationController
  def new
    render :login
  end

  def create
    if user = User.find_by(email: params[:email])
      session[:user_id] = user.id
      redirect_to user
    else
      "Invalid login"
    end
  end

  def destroy
    session[:user_id] = nil
    render :logout
  end
end