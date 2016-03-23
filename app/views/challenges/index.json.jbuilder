json.array!(@challenges) do |challenge|
  json.extract! challenge, :id, :name, :prep_work, :order
  json.url challenge_url(challenge, format: :json)
end
