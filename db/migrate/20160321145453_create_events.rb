class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.datetime :start
      t.datetime :end
      t.integer :challenge_id

      t.timestamps null: false
    end
  end
end
