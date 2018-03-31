module GenerateToken
  extend self

  def call(model:, attribute_name:, length: 40, tries: 100)
    tries.times do
      token = SecureRandom.hex(length)
      return token unless model.class.exists? attribute_name => token
    end
  end
end
