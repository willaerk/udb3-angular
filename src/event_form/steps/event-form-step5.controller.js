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
  $scope.invalidAgeRange = false;
  $scope.ageRange = 0;
  $scope.ageCssClass = EventFormData.ageRange ? 'state-complete' : 'state-incomplete';
  $scope.minAge = '';

  // Organizer vars.
  $scope.organizerCssClass = EventFormData.organizer.name ? 'state-complete' : 'state-incomplete';
  $scope.organizer = '';
  $scope.emptyOrganizerAutocomplete = false;
  $scope.loadingOrganizers = false;
  $scope.organizerError = false;
  $scope.savingOrganizer = false;

  // Booking & tickets vars.
  $scope.editBookingPhone = EventFormData.bookingInfo.phone ? false : true;
  $scope.editBookingEmail = EventFormData.bookingInfo.email ? false : true;
  $scope.editBookingUrl = EventFormData.bookingInfo.url ? false : true;
  $scope.bookingModel = {
    urlRequired : false,
    emailRequired : false,
    phoneRequired : false,
    urlLabel : EventFormData.bookingInfo.urlLabel ? EventFormData.bookingInfo.urlLabel : 'Reserveer plaatsen',
    urlLabelCustom : '',
    availabilityStarts : EventFormData.bookingInfo.availabilityStarts ?
      EventFormData.bookingInfo.availabilityStarts : '',
    availabilityEnds : EventFormData.bookingInfo.availabilityEnds ?
      EventFormData.bookingInfo.availabilityEnds : '',
  };

  $scope.viaWebsite =  EventFormData.bookingInfo.url ? true : false;
  $scope.viaEmail = EventFormData.bookingInfo.email ? true : false;
  $scope.viaPhone = EventFormData.bookingInfo.phone ? true : false;
  $scope.websitePreviewEnabled = false;
  $scope.bookingPeriodPreviewEnabled = false;
  $scope.bookingPeriodShowValidation = false;
  $scope.bookingInfoCssClass = 'state-incomplete';

  $scope.toggleBookingType = toggleBookingType;
  $scope.saveBookingType = saveBookingType;
  $scope.validateBookingType = validateBookingType;
  $scope.saveWebsitePreview = saveWebsitePreview;
  $scope.enableWebsitePreview = enableWebsitePreview;
  $scope.saveBookingPeriod = saveBookingPeriod;
  $scope.enableBookingPeriodPreview = enableBookingPeriodPreview;

  // Contactinfo vars.
  $scope.contactInfoCssClass = 'state-incomplete';
  $scope.savingContactInfo = false;
  $scope.contactInfoError = false;
  $scope.contactInfo = [];

  // Facilities vars.
  $scope.facilitiesCssClass = 'state-incomplete';
  $scope.facilitiesInapplicable = false;
  $scope.selectedFacilities = [];

  // Image upload vars.
  $scope.imageCssClass = EventFormData.mediaObject.length > 0 ? 'state-complete' : 'state-incomplete';

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

  // Image upload functions.
  $scope.openUploadImageModal = openUploadImageModal;
  $scope.openDeleteImageModal = openDeleteImageModal;

  var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

  // Init the controller for editing.
  initEditForm();

  // Add empty contact.
  addContactInfo('', '');

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

    $scope.invalidAgeRange = false;

    if ($scope.ageRange > 0) {

      // Check if the entered age is valid for selected range.
      switch ($scope.ageRange) {

        case 12:

          if ($scope.minAge > 12 || $scope.minAge < 1) {
            $scope.invalidAgeRange = true;
          }

          EventFormData.typicalAgeRange = $scope.minAge + '-' + $scope.ageRange;
          break;

        case 18:

          if ($scope.minAge < 12 || $scope.minAge > 18) {
            $scope.invalidAgeRange = true;
          }

          EventFormData.typicalAgeRange = $scope.minAge + '-' + $scope.ageRange;
          break;

        case 99:

          if ($scope.minAge < 19) {
            $scope.invalidAgeRange = true;
          }

          EventFormData.typicalAgeRange = $scope.minAge + '-';
          break;

      }

    }
    else {
      EventFormData.typicalAgeRange = $scope.ageRange;
    }

    // Save to db if valid age entered.
    if (!$scope.invalidAgeRange) {

      $scope.ageRangeError = false;
      $scope.savingAgeRange = true;
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
  function addContactInfo(type, value) {
    $scope.contactInfo.push({
      type : type,
      value : value
    });

  }

  /**
   * Delete a given contact info item.
   */
  function deleteContactInfo(index) {
    $scope.contactInfo.splice(index, 1);
    saveContactInfo();
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
        if ($scope.contactInfo[i].type === 'url') {
          EventFormData.contactPoint.url.push($scope.contactInfo[i].value);
        }
        else if ($scope.contactInfo[i].type === 'phone') {
          EventFormData.contactPoint.phone.push($scope.contactInfo[i].value);
        }
        else if ($scope.contactInfo[i].type === 'email') {
          EventFormData.contactPoint.email.push($scope.contactInfo[i].value);
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
   * Toggle the booking type and check if info should be deleted.
   */
  function toggleBookingType(type) {

    var saveNeeded = false;
    if (EventFormData.bookingInfo.url && !$scope.viaWebsite) {
      EventFormData.bookingInfo.url = '';
      saveNeeded = true;
    }

    if (EventFormData.bookingInfo.phone && !$scope.viaPhone) {
      EventFormData.bookingInfo.phone = '';
      saveNeeded = true;
    }

    if (EventFormData.bookingInfo.email && !$scope.viaEmail) {
      EventFormData.bookingInfo.email = '';
      saveNeeded = true;
    }

    if (saveNeeded) {
      saveBookingType();
    }

  }

  /**
   * Validates a booking type.
   */
  function validateBookingType(type) {

    if (type === 'website') {

      // Autoset http://.
      if (EventFormData.bookingInfo.url.substring(0, 7) !== 'http://') {
        EventFormData.bookingInfo.url = 'http://' + EventFormData.bookingInfo.url;
      }

      // Valid url?
      $scope.step5TicketsForm.url.$setValidity('url', true);
      if (!URL_REGEXP.test(EventFormData.bookingInfo.url)) {
        $scope.step5TicketsForm.url.$setValidity('url', false);
      }

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
    if (type === 'phone') {
      $scope.editBookingPhone = false;
    }
    else if (type === 'email') {
      $scope.editBookingEmail = false;
    }
    else if (type === 'website') {
      $scope.editBookingUrl = false;
    }

    saveBookingInfo();
  }

  /**
   * Save the website preview settings.
   */
  function saveWebsitePreview() {
    $scope.websitePreviewEnabled = false;
    EventFormData.bookingInfo.urlLabel = $scope.bookingModel.urlLabel;
    if ($scope.bookingModel.urlLabelCustom !== '') {
      EventFormData.bookingInfo.urlLabel = $scope.bookingModel.urlLabelCustom;
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

    EventFormData.bookingInfo.availabilityStarts = $scope.bookingModel.availabilityStarts;
    EventFormData.bookingInfo.availabilityEnds = $scope.bookingModel.availabilityEnds;

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

    // Make sure all default values are set.
    EventFormData.bookingInfo = angular.extend({}, {
      url : '',
      urlLabel : 'Reserveer plaatsen',
      email : '',
      phone : '',
      availabilityStarts : '',
      availabilityEnds : ''
    }, EventFormData.bookingInfo);

    $scope.savingBookingInfo = true;
    $scope.bookingInfoError = false;

    var promise = eventCrud.updateBookingInfo(EventFormData);
    promise.then(function() {
      updateLastUpdated();
      $scope.bookingInfoCssClass = 'state-complete';
      $scope.savingBookingInfo = false;
      $scope.bookingInfoError = false;
    }, function() {
      $scope.savingBookingInfo = false;
      $scope.bookingInfoError = true;
    });
  }

  /**
   * Open the upload modal.
   */
  function openUploadImageModal(indexToEdit) {

    var modalInstance = $modal.open({
      templateUrl: 'templates/event-form-image-upload.html',
      controller: 'EventFormImageUploadCtrl',
      resolve: {
        indexToEdit: function () {
          return indexToEdit;
        },
      }
    });

    modalInstance.result.then(function () {
      $scope.imageCssClass = 'state-complete';
    }, function () {
      // modal dismissed.
      if (EventFormData.mediaObject.length > 0) {
        $scope.imageCssClass = 'state-complete';
      }
      else {
        $scope.imageCssClass = 'state-incomplete';
      }
    });

  }

  /**
   * Open the modal to delete an image.
   */
  function openDeleteImageModal(indexToDelete) {

    var modalInstance = $modal.open({
      templateUrl: 'templates/event-form-image-delete.html',
      controller: 'EventFormImageDeleteCtrl',
      resolve: {
        indexToDelete: function () {
          return indexToDelete;
        },
      }
    });

    modalInstance.result.then(function () {
      if (EventFormData.mediaObject.length > 0) {
        $scope.imageCssClass = 'state-complete';
      }
      else {
        $scope.imageCssClass = 'state-incomplete';
      }
    }, function () {
      // modal dismissed.
      if (EventFormData.mediaObject.length > 0) {
        $scope.imageCssClass = 'state-complete';
      }
      else {
        $scope.imageCssClass = 'state-incomplete';
      }
    });

  }

  /**
   * Init this step for editing.
   */
  function initEditForm() {

    // On edit set state default to complete.
    if (EventFormData.id) {
      $scope.ageCssClass = 'state-complete';
      $scope.ageRange = -1;
      if (EventFormData.typicalAgeRange) {
        var range = EventFormData.typicalAgeRange.split('-');
        if (range[1]) {
          $scope.ageRange = range[1];
          $scope.minAge = parseInt(range[0]);
        }
        else {
          $scope.ageRange = 99;
          $scope.minAge = parseInt(range[0]);
        }
      }
    }

    // Add websites.
    var i = 0;
    if (EventFormData.contactPoint.url) {
      for (i = 0; i < EventFormData.contactPoint.url.length; i++) {
        addContactInfo('url', EventFormData.contactPoint.url[i]);
      }
    }

    // Add mails
    if (EventFormData.contactPoint.email) {
      for (i = 0; i < EventFormData.contactPoint.email.length; i++) {
        addContactInfo('email', EventFormData.contactPoint.email[i]);
      }
    }

    // Add phones
    if (EventFormData.contactPoint.phone) {
      for (i = 0; i < EventFormData.contactPoint.phone.length; i++) {
        addContactInfo('phone', EventFormData.contactPoint.phone[i]);
      }
    }

    // Set correct css class for contact info.
    if ($scope.contactInfo.length > 0) {
      $scope.contactInfoCssClass = 'state-complete';
    }

    // Set class to complete if we have booking info.
    if (EventFormData.bookingInfo.url ||
      EventFormData.bookingInfo.phone ||
      EventFormData.bookingInfo.email ||
      EventFormData.bookingInfo.availabilityStarts ||
      EventFormData.bookingInfo.availabilityEnds
    ) {
      $scope.bookingInfoCssClass = 'state-complete';
    }

    // Set default facilities.
    if (EventFormData.id) {
      $scope.facilitiesCssClass = 'state-complete';
      if (!EventFormData.facilities || EventFormData.facilities.length === 0) {
        $scope.facilitiesInapplicable = true;
      }
      else {
        $scope.selectedFacilities = EventFormData.facilities;
        $scope.facilitiesInapplicable = false;
      }

    }

  }

}
