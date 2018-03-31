class ApplicationController < ActionController::Base
  before_action :authenticate_user!

  respond_to :html

  self.responder = ApplicationResponder

  def current_account
    @current_account ||= current_user.account
  end
end
