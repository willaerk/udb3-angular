'use strict';

describe('Controller: Event', function() {
  var $scope,
      eventController,
      jsonLDLangFilter,
      eventTranslator,
      eventLabeller,
      eventEditor,
      EventTranslationState,
      udbApi,
      UdbEvent;

  beforeEach(module('udb.search'));
  beforeEach(module('udb.templates'));

  beforeEach(inject(function($injector, $rootScope, $controller, $q) {
    $scope = $rootScope.$new();
    udbApi = $injector.get('udbApi');
    jsonLDLangFilter = $injector.get('jsonLDLangFilter');
    eventTranslator = $injector.get('eventTranslator');
    eventLabeller = jasmine.createSpyObj('eventLabeller', ['recentLabels']);
    eventEditor = $injector.get('eventEditor');
    EventTranslationState = $injector.get('EventTranslationState');
    UdbEvent = $injector.get('UdbEvent');

    $scope.event = {};
    var deferredEvent = $q.defer(), deferredVariation = $q.defer();
    deferredEvent.resolve(new UdbEvent(exampleEventJson));
    exampleEventJson.description = {
      'nl': 'een variatie van de originele beschrijving'
    };
    deferredVariation.resolve(new UdbEvent(exampleEventJson));
    spyOn(udbApi, 'getEventByLDId').andReturn(deferredEvent.promise);
    spyOn(eventEditor, 'getPersonalVariation').andReturn(deferredVariation.promise);

    eventController = $controller(
      'EventController', {
        udbApi: udbApi,
        jsonLDLangFilter: jsonLDLangFilter,
        eventTranslator: eventTranslator,
        eventLabeller: eventLabeller,
        eventEditor: eventEditor,
        EventTranslationState: EventTranslationState,
        $scope: $scope
      }
    );
  }));

  it('reverts back to the original event description when deleting the personal variation', function() {
    $scope.$digest();
    //TODO: do some testing here
  });

  var exampleEventJson = {
    "@id": "http://culudb-silex.dev:8080/event/1111be8c-a412-488d-9ecc-8fdf9e52edbc",
    "@context": "/api/1.0/event.jsonld",
    "name": {"nl": "70 mijl in vogelvlucht"},
    "description": {"nl": "Een korte beschrijving voor dit evenement"},
    "available": "2015-06-05T00:00:00+02:00",
    "image": "//media.uitdatabank.be/20150605/0ffd9034-033f-4619-b053-4ef3dd1956e0.png",
    "calendarSummary": "vrij 19/06/15 om 19:00 ",
    "location": {
      "@type": "Place",
      "@id": "http://culudb-silex.dev:8080/place/4D6DD711-CB4F-168D-C8B1DB1D1F8335B4",
      "@context": "/api/1.0/place.jsonld",
      "description": "De werking van het Cultuurcentrum Knokke-Heist is zeer gevarieerd: podiumkunsten, beeldende kunsten, sociaal-cultureel werk met volwassenen, jeugdwerking en jongerencultuur, artistiek-kunstzinnige opleidingen, openluchtanimatie,... Elke bezoeker vindt hier zijn gading!",
      "name": "Cultuurcentrum Scharpoord - Knokke-Heist",
      "address": {
        "addressCountry": "BE",
        "addressLocality": "Knokke-Heist",
        "postalCode": "8300",
        "streetAddress": "Meerlaan 32"
      },
      "bookingInfo": {
        "description": "",
        "name": "standard price",
        "price": 0,
        "priceCurrency": "EUR"
      },
      "terms": [
        {
          "label": "Locatie",
          "domain": "actortype",
          "id": "8.15.0.0.0"
        },
        {
          "label": "Organisator(en)",
          "domain": "actortype",
          "id": "8.11.0.0.0"
        },
        {
          "label": "Voorzieningen voor rolstoelgebruikers",
          "domain": "facility",
          "id": "3.23.1.0.0"
        },
        {
          "label": "Assistentie",
          "domain": "facility",
          "id": "3.23.2.0.0"
        },
        {
          "label": "Rolstoel ter beschikking",
          "domain": "facility",
          "id": "3.23.3.0.0"
        },
        {
          "label": "Ringleiding",
          "domain": "facility",
          "id": "3.17.1.0.0"
        },
        {
          "label": "Regionaal",
          "domain": "publicscope",
          "id": "6.2.0.0.0"
        },
        {
          "label": "Cultuur, gemeenschaps of ontmoetingscentrum",
          "domain": "actortype",
          "id": "8.6.0.0.0"
        }
      ]
    },
    "organizer": {
      "name": ",",
      "@type": "Organizer"
    },
    "bookingInfo": [
      {
        "priceCurrency": "EUR",
        "price": 0
      }
    ],
    "terms": [
      {
        "label": "Documentaires en reportages",
        "domain": "theme",
        "id": "1.7.1.0.0"
      },
      {
        "label": "Regionaal",
        "domain": "publicscope",
        "id": "6.2.0.0.0"
      },
      {
        "label": "Kust",
        "domain": "flanderstouristregion",
        "id": "reg.356"
      },
      {
        "label": "Film",
        "domain": "eventtype",
        "id": "0.50.6.0.0"
      },
      {
        "label": "8300 Knokke-Heist",
        "domain": "flandersregion",
        "id": "reg.1017"
      }
    ],
    "creator": "office@garage64.be",
    "created": "2015-06-05T10:42:15+02:00",
    "modified": "2015-06-05T10:50:17+02:00",
    "publisher": "Invoerders Algemeen ",
    "startDate": "2015-06-19T19:00:00+02:00",
    "calendarType": "single",
    "performer": [{"name": "maaike beuten "}],
    "sameAs": ["http://www.uitinvlaanderen.be/agenda/e/70-mijl-in-vogelvlucht/1111be8c-a412-488d-9ecc-8fdf9e52edbc"],
    "seeAlso": ["http://www.facebook.com/events/1590439757875265"]
  }
});
