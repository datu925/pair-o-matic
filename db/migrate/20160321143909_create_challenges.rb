class CreateChallenges < ActiveRecord::Migration
  def change
    create_table :challenges do |t|
      t.string :name
      t.text :prep_work
      t.integer :order

      t.timestamps null: false
    end
  end
end
