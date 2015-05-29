'use strict';

/**
 * @ngdoc directive
 * @name udb.search.directive:udbEvent
 * @description
 * # udbEvent
 */
angular
  .module('udb.search')
  .directive('udbEvent', udbEvent);

/* @ngInject */
function udbEvent(udbApi, jsonLDLangFilter, eventTranslator, eventLabeller, $q) {
  var event = {
    restrict: 'A',
    link: function postLink(scope, iElement, iAttrs) {

      var TranslationState = {
        ALL: {'name': 'all', 'icon': 'fa-circle'},
        NONE: {'name': 'none', 'icon': 'fa-circle-o'},
        SOME: {'name': 'some', 'icon': 'fa-dot-circle-o'}
      };

      function updateTranslationState(event) {
        var languages = {'en': false, 'fr': false, 'de': false},
            properties = ['name', 'description'];

        _.forEach(languages, function (language, languageKey) {
          var translationCount = 0,
              state;

          _.forEach(properties, function (property) {
            if (event[property] && event[property][languageKey]) {
              ++translationCount;
            }
          });

          if (translationCount) {
            if (translationCount === properties.length) {
              state = TranslationState.ALL;
            } else {
              state = TranslationState.SOME;
            }
          } else {
            state = TranslationState.NONE;
          }

          languages[languageKey] = state;
        });

        event.translationState = languages;
      }

      scope.hasActiveTranslation = function () {
        return event && event.translationState[scope.activeLanguage] !== TranslationState.NONE;
      };

      scope.getLanguageTranslationIcon = function (lang) {
        var icon = TranslationState.NONE.icon;

        if (event && lang) {
          icon = event.translationState[lang].icon;
        }

        return icon;
      };

      scope.translate = function () {
        scope.applyPropertyChanges('name');
        scope.applyPropertyChanges('description');
      };

      scope.activeLanguage = 'nl';
      scope.languageSelector = [
        {'lang': 'fr'},
        {'lang': 'en'},
        {'lang': 'de'}
      ];
      scope.availableLabels = eventLabeller.recentLabels;

      // The event object that's returned from the server
      var event;

      if (!scope.event.title) {
        scope.fetching = true;
        var eventPromise = udbApi.getEventByLDId(scope.event['@id']);

        eventPromise.then(function (eventObject) {
          event = eventObject;
          updateTranslationState(event);
          scope.availableLabels = _.union(event.labels, eventLabeller.recentLabels);
          scope.event = jsonLDLangFilter(event, 'nl');
          scope.fetching = false;
          watchLabels();
        });
      } else {
        scope.fetching = false;
      }

      function watchLabels() {
        scope.$watch(function () {
          return event.labels;
        }, function (labels) {
          scope.event.labels = labels;
        });
      }

      scope.updateDescription = function (data) {
        var deferredUpdate = $q.defer();
        console.log('updating description to: ' + data);

        setTimeout(function () {
          deferredUpdate.resolve();
        }, 1234);

        return deferredUpdate.promise;
      };

      scope.eventTranslation = false;
      /**
       * Sets the provided language as active or toggles it off when already active
       *
       * @param {String} lang
       */
      function toggleLanguage(lang) {

        if (lang === scope.activeLanguage) {
          scope.stopTranslating();
        } else {
          scope.activeLanguage = lang;
          scope.eventTranslation = jsonLDLangFilter(event, scope.activeLanguage);
        }

      }

      scope.toggleLanguage = toggleLanguage;

      scope.hasPropertyChanged = function (propertyName) {
        var lang = scope.activeLanguage,
            translation = scope.eventTranslation;

        return scope.eventTranslation && event[propertyName][lang] !== translation[propertyName];
      };

      scope.undoPropertyChanges = function (propertyName) {
        var lang = scope.activeLanguage,
            translation = scope.eventTranslation;

        if (translation) {
          translation[propertyName] = event[propertyName][lang];
        }
      };

      scope.applyPropertyChanges = function (propertyName) {
        var translation = scope.eventTranslation[propertyName],
            apiProperty;

        // TODO: this is hacky, should decide on consistent name for this property
        if (propertyName === 'name') {
          apiProperty = 'title';
        }

        translateEventProperty(propertyName, translation, apiProperty);
      };

      scope.stopTranslating = function () {
        scope.eventTranslation = undefined;
        scope.activeLanguage = 'nl';
      };

      function translateEventProperty(property, translation, apiProperty) {
        var language = scope.activeLanguage,
            udbProperty = apiProperty || property;

        if (translation && translation !== event[property][language]) {
          var translationPromise = eventTranslator.translateProperty(event, udbProperty, language, translation);

          translationPromise.then(function () {
            updateTranslationState(event);
          });
        }
      }

      scope.labelAdded = function (label) {
        eventLabeller.label(event, label);
      };

      scope.labelRemoved = function (label) {
        eventLabeller.unlabel(event, label);
      };
    }
  };

  return event;
}
