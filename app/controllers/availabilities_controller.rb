class AvailabilitiesController < ApplicationController
  before_action :set_availability, only: [:show, :edit, :update, :destroy]

  # GET /availabilities
  # GET /availabilities.json
  def index
    @availabilities = Availability.where(user: current_user)
  end

  # GET /availabilities/1
  # GET /availabilities/1.json
  def show
  end

  # GET /availabilities/new
  def new
    @availability = Availability.new
  end

  # GET /availabilities/1/edit
  def edit
  end

  # POST /availabilities
  # POST /availabilities.json
  def create
    @availability = Availability.new(availability_params)
    @availability.user_id = session[:user_id]

    respond_to do |format|
      if @availability.save
        format.html { redirect_to @availability, notice: 'Availability was successfully created.' }
        format.json { render :show, status: :created, location: @availability }
      else
        format.html { render :new }
        format.json { render json: @availability.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /availabilities/1
  # PATCH/PUT /availabilities/1.json
  def update
    respond_to do |format|
      if @availability.update(availability_params)
        format.html { redirect_to @availability, notice: 'Availability was successfully updated.' }
        format.json { render :show, status: :ok, location: @availability }
      else
        format.html { render :edit }
        format.json { render json: @availability.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /availabilities/1
  # DELETE /availabilities/1.json
  def destroy
    @availability.destroy
    respond_to do |format|
      format.html { redirect_to availabilities_url, notice: 'Availability was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def get_other
    user = User.find_by(id: session[:user_id])
    other_availabilities = Availability.other_availabilities(user.id)
    event_objects = other_availabilities.map do |availability|
      { :color => '#34AADC', :title => 'Group', :start => "#{availability.start.iso8601}", :end => "#{availability.end.iso8601}", :allDay => false, :overlap => false, id: availability.id, type: "group"}
    end
    user.availabilities.each do |availability|
      event_objects << { :color => '#C2110D', :title => 'Individual', :start => "#{availability.start.iso8601}", :end => "#{availability.end.iso8601}", :allDay => false, :overlap => false, id: availability.id, type: "user"}
    end
    render json: event_objects
  end



  def move
    @availability = Availability.find_by_id(params[:id])
    if @availability
      @availability.start = (params[:minute_delta].to_i).minutes.from_now((params[:day_delta].to_i).days.from_now(@availability.start))
      @availability.end = (params[:minute_delta].to_i).minutes.from_now((params[:day_delta].to_i).days.from_now(@availability.end))
      @availability.save
    end
    render :nothing => true
  end

  def resize
    @availability = Availability.find_by_id(params[:id])
    if @availability
      @availability.end = (params[:minute_delta].to_i).minutes.from_now((params[:day_delta].to_i).days.from_now(@availability.end))
      @availability.save
    end
    render :nothing => true
  end

  def destroy
    @availability = Availability.find_by(id: params[:id])
    @availability.destroy
    render :nothing => true
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_availability
      @availability = Availability.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def availability_params
      params.require(:availability).permit(:start, :end, :status, :user_id, :desired_challenge_id, :enforce_boundaries)
    end
end
