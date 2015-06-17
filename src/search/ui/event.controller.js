'use strict';

/**
 * @ngdoc directive
 * @name udb.search.controller:EventController
 * @description
 * # EventController
 */
angular
  .module('udb.search')
  .controller('EventController', EventController);

/* @ngInject */
function EventController(
  udbApi,
  jsonLDLangFilter,
  eventTranslator,
  eventLabeller,
  eventEditor,
  EventTranslationState,
  $scope
) {
  var controller = this;
  var cachedEvent;

  // Translation
  var defaultLanguage = 'nl';
  controller.eventTranslation = false;
  controller.activeLanguage = defaultLanguage;
  controller.languageSelector = [
    {'lang': 'fr'},
    {'lang': 'en'},
    {'lang': 'de'}
  ];
  controller.availableLabels = eventLabeller.recentLabels;
  initController();

  function initController() {
    if (!$scope.event.title) {
      controller.fetching = true;
      var eventPromise = udbApi.getEventByLDId($scope.event['@id']);

      eventPromise.then(function (eventObject) {
        cachedEvent = eventObject;
        cachedEvent.updateTranslationState();
        controller.availableLabels = _.union(cachedEvent.labels, eventLabeller.recentLabels);

        $scope.event = jsonLDLangFilter(cachedEvent, defaultLanguage);
        controller.fetching = false;
        watchLabels();

        // Try to fetch a personal variation for the event
        fetchPersonalVariation();
      });
    } else {
      controller.fetching = false;
    }

    function fetchPersonalVariation() {
      var personalVariationPromise = eventEditor.getPersonalVariation(cachedEvent);
      personalVariationPromise
        .then(function (personalVariation) {
          $scope.event = jsonLDLangFilter(personalVariation, defaultLanguage);
          watchLabels();
        });
    }

    function watchLabels() {
      $scope.$watch(function () {
        return cachedEvent.labels;
      }, function (labels) {
        $scope.event.labels = labels;
      });
    }
  }

  controller.hasActiveTranslation = function () {
    return cachedEvent && cachedEvent.translationState[controller.activeLanguage] !== EventTranslationState.NONE;
  };

  controller.getLanguageTranslationIcon = function (lang) {
    var icon = EventTranslationState.NONE.icon;

    if (cachedEvent && lang) {
      icon = cachedEvent.translationState[lang].icon;
    }

    return icon;
  };

  controller.translate = function () {
    controller.applyPropertyChanges('name');
    controller.applyPropertyChanges('description');
  };

  /**
   * Sets the provided language as active or toggles it off when already active
   *
   * @param {String} lang
   */
  controller.toggleLanguage = function (lang) {
    if (lang === controller.activeLanguage) {
      controller.stopTranslating();
    } else {
      controller.activeLanguage = lang;
      controller.eventTranslation = jsonLDLangFilter(cachedEvent, controller.activeLanguage);
    }
  };

  controller.hasPropertyChanged = function (propertyName) {
    var lang = controller.activeLanguage,
        translation = controller.eventTranslation;

    return controller.eventTranslation && cachedEvent[propertyName][lang] !== translation[propertyName];
  };

  controller.undoPropertyChanges = function (propertyName) {
    var lang = controller.activeLanguage,
        translation = controller.eventTranslation;

    if (translation) {
      translation[propertyName] = cachedEvent[propertyName][lang];
    }
  };

  controller.applyPropertyChanges = function (propertyName) {
    var translation = controller.eventTranslation[propertyName],
        apiProperty;

    // TODO: this is hacky, should decide on consistent name for this property
    if (propertyName === 'name') {
      apiProperty = 'title';
    }

    translateEventProperty(propertyName, translation, apiProperty);
  };

  controller.stopTranslating = function () {
    controller.eventTranslation = undefined;
    controller.activeLanguage = defaultLanguage;
  };

  function translateEventProperty(property, translation, apiProperty) {
    var language = controller.activeLanguage,
        udbProperty = apiProperty || property;

    if (translation && translation !== cachedEvent[property][language]) {
      var translationPromise = eventTranslator.translateProperty(cachedEvent, udbProperty, language, translation);

      translationPromise.then(function () {
        cachedEvent.updateTranslationState();
      });
    }
  }

  // Labelling
  controller.labelAdded = function (label) {
    eventLabeller.label(cachedEvent, label);
  };

  controller.labelRemoved = function (label) {
    eventLabeller.unlabel(cachedEvent, label);
  };

  // Editing
  controller.updateDescription = function (description) {
    if (!description) {
      var deletePromise = eventEditor.deleteDescription(event, {variation: 'noid'});

      deletePromise.then(function () {
        $scope.event.description = cachedEvent.description[defaultLanguage];
      });

      return deletePromise;
    }

    if ($scope.event.description !== description) {
      return eventEditor.editDescription(cachedEvent, description);
    }
  };

}
