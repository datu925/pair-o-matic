json.array!(@availabilities) do |availability|
  json.extract! availability, :id, :start, :end, :status, :user_id, :desired_challenge_id, :enforce_boundaries
  json.url availability_url(availability, format: :json)
end
