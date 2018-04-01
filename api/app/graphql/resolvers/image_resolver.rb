class Resolvers::ImageResolver < GraphQL::Function
  argument :size, types.Int

  type types.String

  attr_reader :attribute_name

  def initialize(attribute_name)
    @attribute_name = attribute_name
  end

  def call(obj, args, ctx)
    attachment = obj.public_send @attribute_name
    return unless attachment.attached?

    size = args[:size]
    variant = size ? attachment.variant(smart_resize(size * 2)) : attachment
    "http://localhost:3000#{ variant.processed.service_url }"
  end

  private

  def smart_resize(size)
    { resize: "#{size}x#{size}^", gravity: 'center', crop: "#{size}x#{size}+0+0" }
  end
end
