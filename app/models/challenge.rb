class Challenge < ActiveRecord::Base
  has_many :availabilities, foreign_key: :desired_challenge_id
  has_many :meetings
end
