class GameApiKeysController < ApplicationController
  def new
    @api_key = new_record GameApiKey, game_id: params[:game_id]
  end

  def create
    @api_key = create_record GameApiKey, form_params
    respond_with @api_key, location: game_path(@api_key.game)
  end

  def edit
    @api_key = find_record GameApiKey
  end

  def update
    @api_key = update_record GameApiKey, form_params

    respond_with @game, location: game_path(@api_key.game)
  end

  def destroy
    @api_key = destroy_record GameApiKey

    respond_with @game, location: game_path(@api_key.game)
  end

  private

  def form_params
    params.require(:game_api_key).permit(
      :name,
      :game_id,
    )
  end
end
