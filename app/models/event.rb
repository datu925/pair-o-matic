class Event < ActiveRecord::Base
  has_many :bookings
  has_many :attendees, through: :bookings, source: :user
  belongs_to :challenge
end
