(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name udbApp.controller:EventFormStep5Ctrl
   * @description
   * # EventFormStep5Ctrl
   * Step 5 of the event form
   */
  angular
    .module('udb.event-form')
    .controller('EventFormStep5Ctrl', EventFormStep5Controller);

  /* @ngInject */
  function EventFormStep5Controller($scope, EventFormData, eventCrud, udbOrganizers, $modal) {

    // Work hardcoded on this id for now.
    // Event
    EventFormData.id = '2fa0b713-09ac-4a13-b357-5e5c57294b24';

    // Place
    EventFormData.id = 'ad461033-839d-4383-98ab-50afb650da14';
    EventFormData.isEvent = false;
    EventFormData.isPlace = true;

    // Scope vars.
    $scope.eventFormData = EventFormData; // main storage for event form.

    // Description vars.
    $scope.description = EventFormData.getDescription('nl');
    $scope.descriptionCssClass = $scope.description ? 'state-complete' : 'state-incomplete';
    $scope.savingDescription = false;
    $scope.descriptionError = false;

    // Age range vars
    $scope.savingAgeRange = false;
    $scope.ageRangeError = false;
    $scope.ageRange = 0;
    $scope.ageCssClass = EventFormData.ageRange ? 'state-complete' : 'state-incomplete';
    $scope.minAge = '';

    // Organizer vars.
    $scope.organizerCssClass = EventFormData.organizer.id ? 'state-complete' : 'state-incomplete';
    $scope.organizer = '';
    $scope.emptyOrganizerAutocomplete = false;
    $scope.loadingOrganizers = false;
    $scope.organizerError = false;
    $scope.savingOrganizer = false;

    // Contactinfo vars.
    $scope.contactInfoCssClass = EventFormData.contact.length ? 'state-complete' : 'state-incomplete';
    $scope.savingContactInfo = false;
    $scope.contactInfoError = false;

    // Scope functions.
    // Description functions.
    $scope.saveDescription = saveDescription;

    // Age range functions.
    $scope.saveAgeRange = saveAgeRange;
    $scope.changeAgeRange = changeAgeRange;
    $scope.setAllAges = setAllAges;
    $scope.resetAgeRange = resetAgeRange;

    // Organizer functions.
    $scope.getOrganizers = getOrganizers;
    $scope.selectOrganizer = selectOrganizer;
    $scope.deleteOrganizer = deleteOrganizer;
    $scope.openOrganizerModal = openOrganizerModal;

    // Contact info functions.
    $scope.deleteContactInfo = deleteContactInfo;
    $scope.saveContactInfo = saveContactInfo;

    // Check if we have a minAge set on load.
    if (EventFormData.minAge) {
      $scope.ageCssClass = 'state-complete';
    }

    // Add empty contact.
    if (EventFormData.contact.length === 0) {
      EventFormData.addContactInfo('', '');
    }

    /**
     * Save the description.
     */
    function saveDescription() {

      $scope.savingDescription = true;
      $scope.descriptionError = false;

      EventFormData.setDescription($scope.description, 'nl');

      var promise = eventCrud.updateDescription(EventFormData, $scope.description);
      promise.then(function() {

        $scope.savingDescription = false;
        updateLastUpdated();

        // Toggle correct class.
        if ($scope.description) {
          $scope.descriptionCssClass = 'state-complete';
        }
        else {
          $scope.descriptionCssClass = 'state-incomplete';
        }

      },
      // Error occured, show message.
      function() {
        $scope.savingDescription = false;
        $scope.descriptionError = true;
      });

    }

    /**
     * Listener on the age range selection.
     */
    function changeAgeRange() {

      $scope.ageRange = parseInt($scope.ageRange);

      if ($scope.ageRange > 0) {
        $scope.ageCssClass = 'state-complete';
      }
      else {
        setAllAges();
        saveAgeRange();
      }

    }

    /**
     * Save the age range.
     */
    function saveAgeRange() {

      $scope.savingAgeRange = true;
      $scope.ageRangeError = false;

      if ($scope.ageRange > 0) {

        if ($scope.ageRange === 12 || $scope.ageRange === 18) {
          EventFormData.typicalAgeRange = $scope.minAge + '-' + $scope.ageRange;
        }
        else {
          EventFormData.typicalAgeRange = $scope.ageRange + '-';
        }

      }
      else {
        EventFormData.typicalAgeRange = $scope.ageRange;
      }

      var promise = eventCrud.updateTypicalAgeRange(EventFormData);
      promise.then(function() {
        $scope.savingAgeRange = false;
        updateLastUpdated();
        $scope.ageCssClass = 'state-complete';
      }, function() {
        // Error occured.
        $scope.savingAgeRange = false;
        $scope.ageRangeError = true;
      });

    }

    /**
     * Set to all ages.
     */
    function setAllAges() {
      $scope.ageRange = -1;
      EventFormData.setAgeRange(-1);
      $scope.ageCssClass = 'state-complete';
    }

    /**
     * Reset the age selection.
     */
    function resetAgeRange() {
      $scope.ageRange = 0;
      $scope.minAge = '';
      $scope.ageCssClass = 'state-incomplete';
    }

    /**
     * Update the last updated time.
     */
    function updateLastUpdated() {
      // Last updated is not in scope. Themers are free to choose where to place it.
      angular.element('#last-updated').show();
      angular.element('#last-updated span').html(moment(Date.now()).format('HH:mm'));
    }

    /**
     * Autocomplete callback for organizers.
     */
    function getOrganizers(value) {

      $scope.loadingOrganizers = true;

      return udbOrganizers.suggestOrganizers(value).then(function (organizers) {

        if (organizers.length > 0) {
          $scope.emptyOrganizerAutocomplete = false;
        }
        else {
          $scope.emptyOrganizerAutocomplete = true;
        }

        $scope.loadingOrganizers = false;

        return organizers;

      });

    }

    /**
     * Select listener on the typeahead.
     */
    function selectOrganizer() {
      EventFormData.organizer = $scope.organizer;
      saveOrganizer();
    }

    /**
     * Delete the selected organiser.
     */
    function deleteOrganizer() {

      $scope.organizerError = false;

      var promise = eventCrud.deleteOfferOrganizer(EventFormData);
      promise.then(function() {
        updateLastUpdated();
        $scope.organizerCssClass = 'state-incomplete';
        EventFormData.resetOrganizer();
        $scope.savingOrganizer = false;
      }, function() {
        $scope.organizerError = true;
        $scope.savingOrganizer = false;
      });

    }

    /**
     * Open the organizer modal.
     */
    function openOrganizerModal() {

        var modalInstance = $modal.open({
          templateUrl: 'templates/event-form-organizer-modal.html',
          controller: 'EventFormOrganizerModalCtrl',
        });

        modalInstance.result.then(function (organizer) {
          EventFormData.organizer = organizer;
          saveOrganizer();
          $scope.organizer = '';
        }, function () {
          // modal dismissed.
          $scope.organizer = '';
          $scope.emptyOrganizerAutocomplete = false;
          if (EventFormData.organizer.id) {
            $scope.organizerCssClass = 'state-complete';
          }
          else {
            $scope.organizerCssClass = 'state-incomplete';
          }
        });

    }

    /**
     * Save the selected organizer in the backend.
     */
    function saveOrganizer() {

      $scope.emptyOrganizerAutocomplete = false;
      $scope.organizerError = false;
      $scope.savingOrganizer = true;

      $scope.organizer = '';
      var promise = eventCrud.updateOrganizer(EventFormData);
      promise.then(function() {
        updateLastUpdated();
        $scope.organizerCssClass = 'state-complete';
        $scope.savingOrganizer = false;
      }, function() {
        $scope.organizerError = true;
        $scope.savingOrganizer = false;
      });
    }

    /**
     * Delete a given contact info item.
     */
    function deleteContactInfo(index) {
      EventFormData.contact.splice(index, 1);
    }

    /**
     * Save the contact info.
     */
    function saveContactInfo() {

      $scope.savingContactInfo = true;
      $scope.contactInfoError = false;

      // Only save with valid input.
      if ($scope.contactInfo.$valid) {

        var promise = eventCrud.saveContactInfo(EventFormData);
        promise.then(function() {
          updateLastUpdated();
          $scope.contactInfoCssClass = 'state-complete';
          $scope.savingContactInfo = false;
        }, function() {
          $scope.contactInfoError = true;
          $scope.savingContactInfo = false;
        });

      }
    }

  }

})();
