class ApplicationController < ActionController::Base
  before_action :authenticate_user!

  respond_to :html

  self.responder = ApplicationResponder
end
