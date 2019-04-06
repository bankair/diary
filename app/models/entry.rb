class Entry < ApplicationRecord
  belongs_to :diary

  def to_hash
    {
      pseudo: pseudo,
      content: content,
      created_at: created_at
    }
  end
end
