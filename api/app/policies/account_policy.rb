class AccountPolicy
  attr_reader :current_account, :record

  def initialize(current_account, record)
    @current_account = current_account
    @record = record
  end

  def manage?
    account = record.is_a?(Account) ? record : record.account
    account == current_account
  end
end
