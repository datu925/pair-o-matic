json.array!(@user_details) do |user_detail|
  json.extract! user_detail, :id, :prefer_in_person, :time_zone, :prefer_location_cohort, :slack_handle, :phone, :cohort, :year, :location
  json.url user_detail_url(user_detail, format: :json)
end
