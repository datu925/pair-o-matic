require 'rails_helper'
require 'date'

describe Availability do
  let(:availability) { Availability.new }

  it 'has a user association' do
    should belong_to(:user)
  end

  it 'has a challenge association' do
    should belong_to(:challenge)
  end

  it 'other_availabilities' do
    FactoryGirl.define do
      factory :primary_availability, class: Availability do
        start DateTime.now
        user_id 1
      end

      factory :other_availability, class: Availability do
        start DateTime.now
        user_id 2
      end
    end

    primary = FactoryGirl.create(:primary_availability)
    other = FactoryGirl.create(:other_availability)
    expect(Availability.other_availabilities(1).first).to eq(other)
  end
end