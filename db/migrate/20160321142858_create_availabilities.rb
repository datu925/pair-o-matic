class CreateAvailabilities < ActiveRecord::Migration
  def change
    create_table :availabilities do |t|
      t.datetime :start
      t.datetime :end
      t.string :status
      t.integer :user_id
      t.integer :desired_challenge_id
      t.string :enforce_boundaries

      t.timestamps null: false
    end
  end
end
