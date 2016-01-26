'use strict';

describe('Controller: Place', function() {
  var $scope,
      placeController,
      udbApi,
      UdbPlace,
      $q,
      examplePlaceEventJson = {
        '@id': "http://culudb-silex.dev:8080/place/03458606-eb3f-462d-97f3-548710286702",
        '@context': "/api/1.0/place.jsonld",
              name: "Villa 99, een art deco pareltje",
              creator: "christophe.vanthuyne@ronse.be",
              created: "2015-06-14T15:22:33+02:00",
              modified: "2015-12-15T14:08:06+01:00",
              publisher: "Invoerders Algemeen ",
              available: "2015-08-03T00:00:00+02:00",
              sameAs: [ ],
              address: {
            addressCountry: "BE",
                addressLocality: "Ronse",
                postalCode: "9600",
                streetAddress: "Engelsenlaan 99"
          },
          bookingInfo: {
            description: "",
                name: "standard price",
                price: 0,
                priceCurrency: "EUR"
          },
          terms: [
            {
              label: "Vlaamse Ardennen",
              domain: "flanderstouristregion",
              id: "reg.365"
            },
            {
              label: "Monument",
              domain: "eventtype",
              id: "0.14.0.0.0"
            },
            {
              label: "9600 Ronse",
              domain: "flandersregion",
              id: "reg.1417"
            }
          ]
        };

  var deferredEvent, deferredVariation;

  beforeEach(module('udb.search'));
  beforeEach(module('udb.templates'));

  beforeEach(inject(function($injector, $rootScope, $controller, _$q_) {
    $scope = $rootScope.$new();
    udbApi = $injector.get('udbApi');
    UdbPlace = $injector.get('UdbPlace');
    $q = _$q_;

    deferredEvent = $q.defer(); deferredVariation = $q.defer();
    spyOn(udbApi, 'getPlaceByLDId').and.returnValue(deferredEvent.promise);

    $scope.event = {};
    $scope.event['@id'] = examplePlaceEventJson['@id'];

    placeController = $controller(
      'PlaceController', {
        udbApi: udbApi,
        $scope: $scope
      }
    );
  }));

  it('should fetch the place information if not present', function () {
    deferredEvent.resolve(new UdbPlace(examplePlaceEventJson));
    $scope.$digest();

    expect(udbApi.getPlaceByLDId).toHaveBeenCalledWith(
        'http://culudb-silex.dev:8080/place/03458606-eb3f-462d-97f3-548710286702'
    );
  });
});
