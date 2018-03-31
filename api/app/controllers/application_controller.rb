class ApplicationController < ActionController::Base
  before_action :authenticate_user!

  respond_to :html

  self.responder = ApplicationResponder

  private

  def current_account
    @current_account ||= current_user.account
  end

  def ensure_can_manage(record)
    raise Pundit::NotAuthorizedError unless AccountPolicy.new(current_account, record).manage?
  end

  def find_record(scope, id = :none)
    record = scope.find id == :none ? params[:id] : id
    ensure_can_manage record
    record
  end

  def new_record(scope, attributes = {})
    record = scope.new(attributes)
    ensure_can_manage record
    record
  end

  def create_record(scope, attributes)
    record = new_record(scope, attributes)
    record.save
    record
  end

  def update_record(scope, attributes)
    record = find_record scope
    record.update(attributes)
    record
  end

  def destroy_record(scope)
    record = find_record scope
    record.destroy
    record
  end
end
