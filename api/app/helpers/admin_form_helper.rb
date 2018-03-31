module AdminFormHelper
  def admin_form_for(record, options = {}, &block)
    options[:builder] ||= AdminFormBuilder
    simple_form_for record, options, &block
  end

  class AdminFormBuilder < SimpleForm::FormBuilder
    def field_set(title = nil, &block)
      @template.field_set_tag title, class: 'form-group', &block
    end

    def buttons(cancel_path: nil)
      html = button(:submit, 'Submit')
      html << @template.link_to('Cancel', cancel_path, class: 'btn btn-light') if cancel_path
      html
    end

    def image_input(field_name, options = {})
      attachment = object.public_send(field_name)
      preview_tag = image_preview attachment if attachment.attached?
      input_tag = input field_name, as: :file, label: false, wrapper_html: { style: 'display: block !important; margin: 0;' }

      html = label field_name, "#{options[:label] || field_name.to_s.humanize}:", class: 'control-label'
      html << @template.content_tag(:div, "#{preview_tag}#{input_tag}".html_safe, class: 'form-control p-2')

      @template.content_tag :div, html, class: 'form-group'
    end

    private

    def image_preview(attachment)
      image_tag = @template.image_tag(attachment.variant(resize: 'x50'), height: 50, class: 'img-thumbnail')
      link_tag = @template.link_to image_tag, attachment, target: :blank
      @template.content_tag :div, link_tag, class: 'mb-2'
    end
  end
end

