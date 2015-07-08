'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:EventFormStep2Controller
 * @description
 * # EventFormStep2Controller
 * Step 2 of the event form
 */
angular
  .module('udb.event-form')
  .controller('EventFormStep2Controller', EventFormStep2Controller);

/* @ngInject */
function EventFormStep2Controller($scope, EventFormData, UdbOpeningHours) {

  // Scope vars.
  // main storage for event form.
  $scope.eventFormData = EventFormData;

  $scope.calendarLabels = [
    {'label': 'Eén of meerdere dagen', 'id' : 'single', 'eventOnly' : true},
    {'label': 'Van ... tot ... ', 'id' : 'periodic', 'eventOnly' : true},
    {'label' : 'Permanent', 'id' : 'permanent', 'eventOnly' : false}
  ];
  $scope.hasOpeningHours = EventFormData.openingHours.length > 0;

  // Scope functions
  $scope.setCalendarType = setCalendarType;
  $scope.resetCalendar = resetCalendar;
  $scope.addTimestamp = addTimestamp;
  $scope.toggleStartHour = toggleStartHour;
  $scope.toggleEndHour = toggleEndHour;
  $scope.saveOpeningHourDaySelection = saveOpeningHourDaySelection;
  $scope.saveOpeningHours = saveOpeningHours;
  $scope.setMajorInfoChanged = setMajorInfoChanged;

  // Mapping between machine name of days and real output.
  var dayNames = {
    monday : 'Maandag',
    tuesday : 'Dinsdag',
    wednesday : 'Woensdag',
    thursday : 'Donderdag',
    friday : 'Vrijdag',
    saturday : 'Zaterdag',
    sunday : 'Zondag'
  };

  // Set form default correct for the editing calendar type.
  if (EventFormData.calendarType) {
    initCalendar();
  }

  // Load the correct labels.
  if ($scope.hasOpeningHours) {
    initOpeningHours();
  }

  /**
   * Click listener on the calendar type buttons.
   * Activate the selected calendar type.
   */
  function setCalendarType(type) {

    EventFormData.showStep(3);

    // Check if previous calendar type was the same.
    // If so, we don't need to create new openinghours. Just show the previous entered data.
    if (EventFormData.calendarType === type) {
      return;
    }

    // A type is choosen, start a complet new calendar, removing old dat
    $scope.hasOpeningHours = false;
    EventFormData.resetCalendar();
    EventFormData.calendarType = type;

    if (EventFormData.calendarType === 'single') {
      addTimestamp();
    }
    else if (EventFormData.calendarType === 'periodic' || EventFormData.calendarType === 'permanent') {
      EventFormData.addOpeningHour('', '', '');
    }

    initCalendar();

    if (EventFormData.id) {
      EventFormData.majorInfoChanged = true;
    }

  }

  /**
   * Init the calendar for the current selected calendar type.
   */
  function initCalendar() {

    var calendarLabel = '';
    for (var i = 0; i < $scope.calendarLabels.length; i++) {
      if ($scope.calendarLabels[i].id === EventFormData.calendarType) {
        calendarLabel = $scope.calendarLabels[i].label;
        break;
      }
    }
    EventFormData.activeCalendarType = EventFormData.calendarType;
    EventFormData.activeCalendarLabel = calendarLabel;

  }

  /**
   * Init the opening hours.
   */
  function initOpeningHours() {
    for (var i = 0; i < EventFormData.openingHours.length; i++) {
      saveOpeningHourDaySelection(i, EventFormData.openingHours[i].dayOfWeek);
    }
  }

  /**
   * Click listener to reset the calendar. User can select a new calendar type.
   */
  function resetCalendar() {
    EventFormData.activeCalendarType = '';
  }

  /**
   * Add a single date to the item.
   */
  function addTimestamp() {
    EventFormData.addTimestamp('', '', '');
  }

  /**
   * Toggle the starthour field for given timestamp.
   * @param {string} timestamp
   *   Timestamp to change
   */
  function toggleStartHour(timestamp) {

    // If we hide the textfield, empty all other time fields.
    if (!timestamp.showStartHour) {
      timestamp.startHour = '';
      timestamp.endHour = '';
      timestamp.showEndHour = false;
    }

  }

  /**
   * Toggle the endhour field for given timestamp
   * @param {string} timestamp
   *   Timestamp to change
   */
  function toggleEndHour(timestamp) {

    // If we hide the textfield, empty also the input.
    if (!timestamp.showEndHour) {
      timestamp.endHour = '';
    }

  }

  /**
   * Change listener on the day selection of opening hours.
   * Create human labels for the day selection.
   */
  function saveOpeningHourDaySelection(index, dayOfWeek) {

    var humanValues = [];
    if (dayOfWeek instanceof Array) {
      for (var i in dayOfWeek) {
        humanValues.push(dayNames[dayOfWeek[i]]);
      }
    }

    EventFormData.openingHours[index].label = humanValues.join(', ');

  }

  /**
   * Save the opening hours.
   */
  function saveOpeningHours() {
    $scope.hasOpeningHours = true;
    setMajorInfoChanged();
  }

  /**
   * Mark the major info as changed.
   */
  function setMajorInfoChanged() {
    if (EventFormData.id) {
      EventFormData.majorInfoChanged = true;
    }
  }

}
