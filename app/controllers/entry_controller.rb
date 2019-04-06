class EntryController < ApplicationController
  before_action { @diary = Diary.find(params.require(:diary_id)) }

  def create
    pseudo, content = params.require(%i(pseudo content))
    details = params[:details]
    render json: @diary.entries.create!(pseudo: pseudo, content: content, details: details)
  end

  def destroy
    @diary.entries.find(params.require(:id)).destroy
    head :ok
  end
end
