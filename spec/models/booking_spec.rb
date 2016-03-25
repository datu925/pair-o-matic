require 'rails_helper'

describe Booking do
  let(:booking) { Booking.new({event: event, user: user}) }

  it 'has a user association' do
    should belong_to(:user)
  end

  it 'has an event association' do
    should belong_to(:event)
  end
end