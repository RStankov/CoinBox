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

  def attachment_image_tag(attachment, height: nil, size: nil, **args)
    return unless attachment.attached?

    if size.present?
      image_tag attachment.variant(smart_resize(size * 2)), size: size, **args
    elsif height.present?
      image_tag attachment.variant(resize: "x#{height * 2}"), height: height, **args
    else
      image_tag attachment, args
    end
  end

  private

  def smart_resize(size)
    { resize: "#{size}x#{size}^", gravity: 'center', crop: "#{size}x#{size}+0+0" }
  end
end
