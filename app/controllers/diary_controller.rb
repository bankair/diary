class DiaryController < ApplicationController
  def index
    @diaries = Diary.all
  end

  def show
    @diary = Diary.find(params.require(:id))
  end
end
