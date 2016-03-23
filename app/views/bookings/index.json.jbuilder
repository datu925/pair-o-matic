json.array!(@bookings) do |booking|
  json.extract! booking, :id, :event_id, :user_id
  json.url booking_url(booking, format: :json)
end
