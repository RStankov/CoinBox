class DashboardController < ApplicationController
  def index
    redirect_to games_path
  end
end
