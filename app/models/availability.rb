class Availability < ActiveRecord::Base
  belongs_to :user
  belongs_to :challenge, foreign_key: "desired_challenge_id"

  def self.other_availabilities(user_id)
    where.not(user_id: user_id)
  end
end
