class TransferablesController < ApplicationController
  def new
    @transferable = new_record Transferable, game_id: params[:game_id]
  end

  def create
    @transferable = create_record Transferable, form_params
    respond_with @transferable, location: game_path(@transferable.game)
  end

  def edit
    @transferable = find_record Transferable
  end

  def update
    @transferable = update_record Transferable, form_params

    respond_with @transferable, location: game_path(@transferable.game)
  end

  def destroy
    @transferable = destroy_record Transferable

    respond_with @transferable, location: game_path(@transferable.game)
  end

  private

  def form_params
    params.require(:transferable).permit(
      :game_id,
      :identifier,
      :name,
      :value,
      :image,
      properties: {},
    )
  end
end
