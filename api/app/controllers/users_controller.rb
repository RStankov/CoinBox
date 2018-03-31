class UsersController < ApplicationController
  def edit
    @form = ProfileForm.new(current_user)
  end

  def update
    @form = ProfileForm.new(current_user)
    @form.update user_params

    respond_with @form, location: edit_user_path
  end

  private

  def user_params
    params.require(:profile_form).permit(
      :name,
      :email,
      :password,
      :password_confirmation,
      :account_name,
    )
  end
end

