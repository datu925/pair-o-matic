class User < ActiveRecord::Base

  has_one :user_detail
  has_many :bookings
  has_many :events, through: :bookings
  has_many :availabilities


  has_secure_password
end
