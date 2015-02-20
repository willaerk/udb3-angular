(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name udbApp.controller:NewEventCtrl
   * @description
   * # NewEventCtrl
   * udbApp controller
   */
  angular
    .module('udb.event-form')
    .controller('EventFormCtrl', EventFormController);

  EventFormController.$inject = ['udbApi', '$scope', '$controller', '$location', 'UdbEvent', 'UdbTimestamps', 'UdbPlace', 'moment', 'eventCrud'];

  function EventFormController(udbApi, $scope, $controller, $window, UdbEvent, UdbTimestamps, UdbPlace, moment, eventCrud) {

    $scope.showStep1 = true;
    $scope.showStep2 = false;
    $scope.showStep3 = false;
    $scope.showStep4 = false;
    $scope.showStep5 = false;
    $scope.lastUpdated = '';
    $scope.type = type;
    $scope.item = item;

    $scope.showStep = showStep;
    $scope.saveItem = saveItem;
    $scope.validateItem = validateItem;

    var type = 'event';

    console.warn('ok');
    // Get the categories.
    var categories = $http.get('categories.json').success(function(response) {
        console.log(response.data);
        return;
    });

    var item = new UdbEvent();
    item.setName('my name', 'nl');
    item.setEventType('0.50.4.0.0', 'Concert');
    item.setTheme('1.8.3.5.0', 'Amusementsmuziek');

    var calendar = new UdbTimestamps();
    calendar.addTimestamp('06/06/15', '12:00', '13:00');
    calendar.addTimestamp('07/06/15', '12:00', '13:00');
    calendar.addTimestamp('08/06/15', '12:00', '13:00');
    item.setCalendar(calendar);

    var location = new UdbPlace();
    location.setLocality('Gent');
    location.setPostal(9000);
    item.setLocation(location);

    /**
     * Show the given step.
     * @param int stepNumber
     */
    function showStep(stepNumber) {
      $scope['showStep' + stepNumber] = true;
    }

    /**
     * Hide the given step.
     * @param int stepNumber
     */
    function hideStep(stepNumber) {
      $scope['showStep' + stepNumber] = false;
    }

    /**
     * Validate the event / place.
     */
    function validateItem() {
      showStep(5);
      saveItem();
    }

    /**
     * Save the event / place.
     */
    function saveItem() {

      if (type == 'event') {
        eventCrud.createEvent(item);
      }

      $scope.lastUpdated = moment(Date.now()).format('DD/MM/YYYY HH:mm:s');
    }

  }

})();
