class ConsumablesController < ApplicationController
  def new
    @consumable = new_record Consumable, game_id: params[:game_id]
  end

  def create
    @consumable = create_record Consumable, form_params
    respond_with @consumable, location: game_path(@consumable.game)
  end

  def edit
    @consumable = find_record Consumable
  end

  def update
    @consumable = update_record Consumable, form_params

    respond_with @consumable, location: game_path(@consumable.game)
  end

  def destroy
    @consumable = destroy_record Consumable

    respond_with @consumable, location: game_path(@consumable.game)
  end

  private

  def form_params
    params.require(:consumable).permit(
      :game_id,
      :name,
      :identifier,
      :value,
      :tradeable,
      :primary,
      :image,
    )
  end
end
