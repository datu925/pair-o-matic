class SessionsController < ApplicationController
  def new
    render :login
  end

  def create
    user = User.find_by(email: params[:session][:email])
    if user.try(:authenticate, params[:session][:password])
      session[:user_id] = user.id
      redirect_to profile_path
    else
      render "Invalid login"
    end
  end

  def destroy
    session[:user_id] = nil
    render :logout
  end
end