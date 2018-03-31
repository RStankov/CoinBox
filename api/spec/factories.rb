FactoryBot.define do
  factory :user do
    sequence(:email) { |i| "user-#{ i }@example.com" }
    name { 'Test Testers' }
    password { 'secret' }
  end
end
