class PlayersController < ApplicationController
  def index
    @game = find_record(Game, params[:game_id])
    @players = @game.players.page(params[:page])
  end

  def show
    @player = find_record Player
  end

  def destroy
    @player = destroy_record Player

    respond_with @player, location: game_path(@player.game)
  end
end
