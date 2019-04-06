class EntryController < ApplicationController
  before_action { @diary = Diary.find(params.require(:diary_id)) }

  def create
    pseudo, content = params.require(%i(pseudo content))
    render json: @diary.entries.create!(pseudo: pseudo, content: content)
  end
end
