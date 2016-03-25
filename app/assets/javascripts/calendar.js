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
        $('#calendar').fullCalendar('renderEvent',eventData);
        $.ajax({
          url: '/availabilities',
          method: 'POST',
          data: {availability: { start: startFormatted, end: endFormatted }},
          success: refetch_events_and_close_dialog
        });
      },

      eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc){
        moveEvent(event, dayDelta, minuteDelta, allDay);
      },

      eventResize: function(event, dayDelta, minuteDelta, revertFunc){
        resizeEvent(event, dayDelta, minuteDelta);
      },

      eventClick: function(event, jsEvent, view){
        debugger;
        showEventDetails(event);
      },

  })

})




function moveEvent(event, dayDelta, minuteDelta, allDay){
    jQuery.ajax({
        data: 'id=' + event.id + '&title=' + event.title + '&day_delta=' + dayDelta + '&minute_delta=' + minuteDelta + '&all_day=' + allDay,
        dataType: 'script',
        type: 'post',
        url: "/availabilities/move"
    });
}

function resizeEvent(event, dayDelta, minuteDelta){
    jQuery.ajax({
        data: 'id=' + event.id + '&title=' + event.title + '&day_delta=' + dayDelta + '&minute_delta=' + minuteDelta,
        dataType: 'script',
        type: 'post',
        url: "/availabilities/resize"
    });
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

