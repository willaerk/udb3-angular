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

    EventFormData.showStep(5);

    // Work hardcoded on this id for now.
    // Event
    // local event nils
    EventFormData.id = '9bd5b8dc-6637-4f93-afe4-1707c71b1b37';

    // local event jochen
    // EventFormData.id = 'bc47b5e6-a7ae-4737-a6e0-bb7b243f1989';

    // Place
    // local place nils
    EventFormData.id = '1c16ad11-071c-40da-bdc6-9ec4e866fdb0';

    // local place jochen
    // EventFormData.id = 'x';

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

    // Booking & tickets vars.
    $scope.bookingInfo = {
      price : '',
      currency : 'EUR',
      availabilityStarts : '',
      availabilityEnds : '',
      name : '',
      description : '',
      url : '',
      urlLabel : 'Koop tickets',
      email : '',
      phone : '',
      validFrom : '',
      validThrough : ''
    };
    $scope.bookingModel = {
      url : '',
      urlRequired : false,
      urlLabel : '',
      urlLabelCustom : '',
      email : '',
      emailRequired : false,
      phone : '',
      phoneRequired : false,
      availabilityStarts : '',
      availabilityEnds : ''
    };
    $scope.viaWebsite = false;
    $scope.viaEmail = false;
    $scope.viaPhone = false;
    $scope.websitePreviewEnabled = false;
    $scope.bookingPeriodPreviewEnabled = false;
    $scope.bookingPeriodShowValidation = false;
    $scope.enableBookingType = enableBookingType;
    $scope.saveBookingType = saveBookingType;
    $scope.validateBookingType = validateBookingType;
    $scope.resetBookingType = resetBookingType;
    $scope.saveWebsitePreview = saveWebsitePreview;
    $scope.enableWebsitePreview = enableWebsitePreview;
    $scope.saveBookingPeriod = saveBookingPeriod;
    $scope.enableBookingPeriodPreview = enableBookingPeriodPreview;

    // Contactinfo vars.
    $scope.contactInfoCssClass = EventFormData.contactPoint.length ? 'state-complete' : 'state-incomplete';
    $scope.savingContactInfo = false;
    $scope.contactInfoError = false;
    $scope.contactInfo = [];

    // Facilities vars.
    $scope.facilitiesCssClass = 'state-incomplete';
    $scope.facilitiesInapplicable = false;
    $scope.selectedFacilities = EventFormData.facilities;

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
    $scope.addContactInfo = addContactInfo;

    // Facilities functions.
    $scope.openFacilitiesModal = openFacilitiesModal;
    $scope.setFacilitiesInapplicable = setFacilitiesInapplicable;

    // Check if we have a minAge set on load.
    if (EventFormData.minAge) {
      $scope.ageCssClass = 'state-complete';
    }

    // Add empty contact.
    addContactInfo();

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
     * Add contact info.
     */
    function addContactInfo() {
      $scope.contactInfo.push({
        type : '',
        value : ''
      });

    }

    /**
     * Delete a given contact info item.
     */
    function deleteContactInfo(index) {
      $scope.contactInfo.splice(index, 1);
    }

    /**
     * Save the contact info.
     */
    function saveContactInfo() {

      $scope.savingContactInfo = true;
      $scope.contactInfoError = false;

      // Only save with valid input.
      if ($scope.contactInfoForm.$valid) {

      EventFormData.resetContactPoint();

        // Copy all data to the correct contactpoint property.
        for (var i = 0; i < $scope.contactInfo.length; i++) {
          if ($scope.contactInfo.type === 'url') {
            EventFormData.contactPoint.url.push($scope.contactInfo.value);
          }
          else if ($scope.contactInfo.type === 'phone') {
            EventFormData.contactPoint.phone.push($scope.contactInfo.value);
          }
          else if ($scope.contactInfo.type === 'email') {
            EventFormData.contactPoint.email.push($scope.contactInfo.value);
          }
        }

        var promise = eventCrud.updateContactPoint(EventFormData);
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

    /**
     * Open the facilities modal.
     */
    function openFacilitiesModal() {

      var modalInstance = $modal.open({
        templateUrl: 'templates/event-form-facilities-modal.html',
        controller: 'EventFormFacilitiesModalCtrl',
      });

      modalInstance.result.then(function () {

        $scope.facilitiesCssClass = 'state-complete';
        $scope.selectedFacilities = EventFormData.facilities;

        if (EventFormData.facilities.length > 0) {
          $scope.facilitiesInapplicable = false;
        }
        else {
          $scope.facilitiesInapplicable = true;
        }
      }, function () {
        // modal dismissed.
        if (EventFormData.facilities.length > 0 || $scope.facilitiesInapplicable) {
          $scope.facilitiesCssClass = 'state-complete';
        }
        else {
          $scope.facilitiesCssClass = 'state-incomplete';
        }
      });

    }

    /**
     * Remove all facilities and set it to inapplicable.
     */
    function setFacilitiesInapplicable() {

      // Delete facilities.
      if (EventFormData.facilities.length > 0) {

        $scope.facilitiesError = false;
        EventFormData.facilities = [];

        var promise = eventCrud.updateFacilities(EventFormData);
        promise.then(function() {
          $scope.savingFacilities = false;
          $scope.facilitiesInapplicable = true;
          $scope.facilitiesCssClass = 'state-complete';
        }, function() {
          $scope.savingFacilities = false;
          $scope.facilitiesError = true;
        });

      }
      else {
        $scope.facilitiesInapplicable = true;
        $scope.facilitiesCssClass = 'state-complete';
      }
    }

    /**
     * Enables a booking type.
     */
    function enableBookingType(type) {
      if (type === 'website') {
        $scope.viaWebsite = !$scope.viaWebsite;
      }
      else if (type === 'email') {
        $scope.viaEmail = !$scope.viaEmail;
      }
      else if (type === 'phone') {
        $scope.viaPhone = !$scope.viaPhone;
      }
    }

    /**
     * Validates a booking type.
     */
    function validateBookingType(type) {

      if (type === 'website') {
        $scope.bookingModel.urlRequired = true;
        $scope.bookingModel.emailRequired = false;
        $scope.bookingModel.phoneRequired = false;
      }
      else if (type === 'email') {
        $scope.bookingModel.emailRequired = true;
        $scope.bookingModel.urlRequired = false;
        $scope.bookingModel.phoneRequired = false;
      }
      else if (type === 'phone') {
        $scope.bookingModel.phoneRequired = true;
        $scope.bookingModel.emailRequired = false;
        $scope.bookingModel.urlRequired = false;
      }

      // Forms are automatically known in scope.
      if (!$scope.step5TicketsForm.$valid) {
        return;
      }

      saveBookingType(type);

    }

    /**
     * Temporarily save a booking type.
     */
    function saveBookingType(type) {
      if (type === 'website') {
        $scope.viaWebsite = true;
        $scope.bookingInfo.url = $scope.bookingModel.url;
      }
      else if (type === 'email') {
        $scope.viaEmail = true;
        $scope.bookingInfo.email = $scope.bookingModel.email;
      }
      else if (type === 'phone') {
        $scope.viaPhone = true;
        $scope.bookingInfo.phone = $scope.bookingModel.phone;
      }
      saveBookingInfo();
    }

    /**
     * @param {type} type
     */
    function resetBookingType(type) {
      if (type === 'website') {
        $scope.bookingInfo.url = $scope.bookingModel.url = '';
      }
      else if (type === 'email') {
        $scope.bookingInfo.email = $scope.bookingModel.email = '';
      }
      else if (type === 'phone') {
        $scope.bookingInfo.phone = $scope.bookingModel.phone = '';
      }
    }

    /**
     * Save the website preview settings.
     */
    function saveWebsitePreview() {
      $scope.websitePreviewEnabled = false;
      $scope.bookingInfo.urlLabel = $scope.bookingModel.urlLabel;
      if ($scope.bookingModel.urlLabelCustom !== '') {
        $scope.bookingInfo.urlLabel = $scope.bookingModel.urlLabelCustom;
      }
      saveBookingInfo();
    }

    /**
     * Enable the website preview modal.
     */
    function enableWebsitePreview() {
      $scope.websitePreviewEnabled = true;
    }

    /**
     * Save the booking period settings.
     */
    function saveBookingPeriod() {

      $scope.bookingPeriodShowValidation = true;

      // Forms are automatically known in scope.
      if (!$scope.step5TicketsForm.$valid) {
        return;
      }

      $scope.bookingPeriodPreviewEnabled = false;

      $scope.bookingInfo.availabilityStarts = $scope.bookingModel.availabilityStarts;
      $scope.bookingInfo.availabilityEnds = $scope.bookingModel.availabilityEnds;

      saveBookingInfo();

    }

    /**
     * Enable the booking period preview modal.
     */
    function enableBookingPeriodPreview() {
      $scope.bookingPeriodPreviewEnabled = true;
    }

    /**
     * Saves the booking info
     */
    function saveBookingInfo() {

      EventFormData.setBookingInfo($scope.bookingInfo);
      //

      var promise = eventCrud.updateBookingInfo(EventFormData);
      promise.then(function() {
        updateLastUpdated();
      }, function() {
      });
    }

  }

})();
