class CreateEntries < ActiveRecord::Migration[5.2]
  def change
    create_table :entries do |t|
      t.references :diary, foreign_key: true
      t.string :pseudo, limit: 30
      t.string :content
      t.string :details

      t.timestamps
    end
  end
end
