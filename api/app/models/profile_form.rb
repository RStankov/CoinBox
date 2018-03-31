class ProfileForm
  include MiniForm::Model

  model :user, attributes: %i(name email password password_confirmation), save: true
  model :account, attributes: %i(name), save: true, prefix: true

  def initialize(user)
    @user = user
    @account = user.account
  end

  def password=(value)
    user.password = value if value.present?
  end

  def password_confirmation=(value)
    user.password_confirmation = value if value.present?
  end

  def persisted?
    true
  end
end
