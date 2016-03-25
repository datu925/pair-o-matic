$(function() {

  $('#calendar').fullCalendar({
      // put your options and callbacks here
      defaultView: "agendaWeek",
      allDaySlot: false,
      editable: true,
      selectable: true,
      selectHelper: true,
      selectOverlap: false,
      businessHours: true,
      height: 500,
      slotMinutes: 30,
      timeFormat: 'hh tt{ - hh tt}',
      dragOpacity: "0.5",
      events: '/availabilities/other',

      select: function(start, end){
        var startFormatted = moment(start).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        var endFormatted = moment(end).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")

        var eventData = {
          allDay: false,
          color: '#C2110D',
          title: 'Available',
          start: startFormatted,
          end: endFormatted,
        }

        if (checkOverlap(start, end)) {
          toastr.error("Your availabilities cannot overlap!");
        } else {
          $('#calendar').fullCalendar('renderEvent',eventData);
          $.ajax({
            url: '/availabilities',
            method: 'POST',
            data: {availability: { start: startFormatted, end: endFormatted }},
            success: refetch_events_and_close_dialog
          });
        }
      },

      eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc){
        moveEvent(event, dayDelta, minuteDelta, allDay, revertFunc);
      },

      eventResize: function(event, dayDelta, minuteDelta, revertFunc){
        resizeEvent(event, dayDelta, minuteDelta, revertFunc);
      },

      eventClick: function(event, jsEvent, view){
        if (event.type == "user") {
          showEventDetails(event);
        } else {

        }
      },

  })

})




function moveEvent(event, dayDelta, minuteDelta, allDay, revertFunc){
  if (event.type === "group") {
    toastr.error("You can't modify group availability!");
    revertFunc();
  } else if (checkOverlap(event.start, event.end)) {
    toastr.error("Your availabilities cannot overlap!");
    revertFunc();
  } else {
    jQuery.ajax({
        data: 'id=' + event.id + '&title=' + event.title + '&day_delta=' + dayDelta + '&minute_delta=' + minuteDelta + '&all_day=' + allDay,
        dataType: 'script',
        type: 'post',
        url: "/availabilities/move"
    });
  }
}

function resizeEvent(event, dayDelta, minuteDelta, revertFunc){
  if (event.type === "group") {
    toastr.error("You can't modify group availability!");
    revertFunc();
  } else if (checkOverlap(event.start, event.end)) {
    toastr.error("Your availabilities cannot overlap!");
    revertFunc();
  } else {
    jQuery.ajax({
        data: 'id=' + event.id + '&title=' + event.title + '&day_delta=' + dayDelta + '&minute_delta=' + minuteDelta,
        dataType: 'script',
        type: 'post',
        url: "/availabilities/resize"
    });
  }
}

function showEventDetails(event){
    $('#event_desc').html(event.description);
    $('#edit_event').html("<a href = 'javascript:void(0);' onclick ='editEvent(" + event.id + ")'>Edit</a>");
    if (event.recurring) {
        title = event.title + "(Recurring)";
        $('#delete_event').html("&nbsp; <a href = 'javascript:void(0);' onclick ='deleteEvent(" + event.id + ", " + false + ")'>Delete Only This Occurrence</a>");
        $('#delete_event').append("&nbsp;&nbsp; <a href = 'javascript:void(0);' onclick ='deleteEvent(" + event.id + ", " + true + ")'>Delete All In Series</a>")
        $('#delete_event').append("&nbsp;&nbsp; <a href = 'javascript:void(0);' onclick ='deleteEvent(" + event.id + ", \"future\")'>Delete All Future Events</a>")
    }
    else {
        title = event.title;
        if(event.id != undefined) {
            $('#delete_event').html("<a href = 'javascript:void(0);' onclick ='deleteEvent(" + event.id + ", " + false + ")'>Delete</a>");
        } else {
            $('#delete_event').html('');
        }
    }
    $('#desc_dialog').dialog({
        title: title,
        modal: true,
        width: 500,
        close: function(event, ui){
            $('#desc_dialog').dialog('destroy')
        }

    });

}

function deleteEvent(event_id, delete_all){
  var url = "/availabilities/" + event_id;
  jQuery.ajax({
    data: 'delete_all=' + delete_all,
    dataType: 'script',
    type: 'delete',
    url: url,
    success: refetch_events_and_close_dialog
  });
}

function refetch_events_and_close_dialog() {
  $('#calendar').fullCalendar( 'refetchEvents' );
  $('.dialog:visible').dialog('destroy');
}

function checkOverlap(eventStart, eventEnd) {
  var start = new Date(eventStart);
  var end = new Date(eventEnd);

  var overlap = $('#calendar').fullCalendar('clientEvents', function(ev) {
    if( ev == event || ev.id === undefined) {
      return false;
    }
    var estart = new Date(ev.start);
    var eend = new Date(ev.end);

    return (
    ( Math.round(start) > Math.round(estart) && Math.round(start) < Math.round(eend) )
    ||
    ( Math.round(end) > Math.round(estart) && Math.round(end) < Math.round(eend) )
    ||
    ( Math.round(start) <= Math.round(estart) && Math.round(end) >= Math.round(eend) )
    );
  });
  if (overlap.length){
    return true;
  } else {
    return false;
  }
}