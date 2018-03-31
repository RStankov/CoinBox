module ApplicationHelper
  def action_link(text, path, options = {})
    options[:class] = 'btn btn-light'
    link_to text, path, options
  end

  def edit_action(path)
    action_link 'Edit', path
  end

  def delete_action(path)
    action_link 'Delete', path, method: :delete, 'data-confirm' => 'Are you sure?'
  end
end
