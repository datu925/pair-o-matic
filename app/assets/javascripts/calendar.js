$(function() {

  $('#calendar').fullCalendar({
      // put your options and callbacks here
      defaultView: "agendaWeek",
      allDaySlot: false,
      editable: true,
      selectable: true,
      selectHelper: true,
      selectOverlap: false,
      height: 500,
      slotMinutes: 30,
      timeFormat: 'hh tt{ - hh tt}',
      dragOpacity: "0.5",
      events: '/availabilities/other'
  })

})
