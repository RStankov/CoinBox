class GamesController < ApplicationController
  def index
    @games = current_account.games.all
  end

  def new
    @game = current_account.games.new
  end

  def create
    @game = current_account.games.create game_params
    respond_with @game, location: games_path
  end

  def show
    @game = current_account.games.find game_id
    redirect_to edit_game_path(@game)
  end

  def edit
    @game = current_account.games.find game_id
  end

  def update
    @game = current_account.games.update game_id, game_params
    respond_with @game, location: games_path
  end

  def destroy
    @game = current_account.games.destroy game_id
    respond_with @game, location: games_path
  end

  private

  def game_id
    params[:id]
  end

  def game_params
    params.require(:game).permit(
      :name,
      :icon,
    )
  end
end
