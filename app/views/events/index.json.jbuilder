json.array!(@events) do |event|
  json.extract! event, :id, :start, :end, :challenge_id
  json.url event_url(event, format: :json)
end
