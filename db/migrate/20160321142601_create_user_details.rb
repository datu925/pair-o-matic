class CreateUserDetails < ActiveRecord::Migration
  def change
    create_table :user_details do |t|
      t.boolean :prefer_in_person
      t.string :time_zone
      t.boolean :prefer_location_cohort
      t.string :slack_handle
      t.string :phone
      t.string :cohort
      t.integer :year
      t.string :location

      t.timestamps null: false
    end
  end
end
