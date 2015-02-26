'use strict';

/**
 * @ngdoc service
 * @name udb.search.queryFieldTranslations
 * @description
 * # queryFieldTranslations
 * Value in the udb.search.
 */
angular
  .module('udb.search')
  .constant('queryFieldTranslations', {
    en: {
      'KEYWORDS' : 'label',
      'PHYSICAL_GIS' : 'geo',
      'CATEGORY_NAME' : 'category',
      'DETAIL_LANG' : 'translation',
      'ORGANISER_LABEL' : 'organiser',
      'LOCATION_LABEL' : 'location',
      'CREATIONDATE' : 'created',
      'CATEGORY_EVENTTYPE_NAME' : 'eventtype',
      'CATEGORY_THEME_NAME' : 'theme',
      'CATEGORY_FACILITY_NAME' : 'facility',
      'CATEGORY_TARGETAUDIENCE_NAME' : 'targetaudience',
      'CATEGORY_FLANDERSREGION_NAME' : 'region',
      'CATEGORY_PUBLICSCOPE_NAME' : 'publicscope',
      'AVAILABLEFROM' : 'available'
    },
    fr: {
        LOCATION_LABEL: 'location',
        TITLE: 'titre'
    },
    nl: {
      'TYPE' : 'type',
      'CDBID' : 'cdbid',
      'TITLE' : 'titel',
      'KEYWORDS' : 'label',
      'CITY' : 'gemeente',
      'ORGANISER_KEYWORDS': 'organisatie-tag',
      'ZIPCODE' : 'postcode',
      'COUNTRY' : 'land',
      'PHYSICAL_GIS' : 'geo',
      'CATEGORY_NAME' : 'categorie',
      'AGEFROM' : 'leeftijd-vanaf',
      'DETAIL_LANG' : 'vertaling',
      'PRICE' : 'prijs',
      'STARTDATE' : 'start-datum',
      'ENDDATE' : 'eind-datum',
      'ORGANISER_LABEL' : 'organisatie',
      'LOCATION_LABEL' : 'locatie',
      'EXTERNALID' : 'externalid',
      'LASTUPDATED' : 'laatst-aangepast',
      'LASTUPDATEDBY' : 'laatst-aangepast-door',
      'CREATIONDATE' : 'gecreeerd',
      'CREATEDBY' : 'gecreeerd-door',
      'PERMANENT' : 'permanent',
      'DATETYPE' : 'wanneer',
      'CATEGORY_EVENTTYPE_NAME' : 'event-type',
      'CATEGORY_THEME_NAME' : 'thema',
      'CATEGORY_FACILITY_NAME' : 'voorziening',
      'CATEGORY_TARGETAUDIENCE_NAME' : 'doelgroep',
      'CATEGORY_FLANDERSREGION_NAME' : 'gebied',
      'CATEGORY_PUBLICSCOPE_NAME' : 'publieksbereik',
      'LIKE_COUNT' : 'aantal-likes',
      'RECOMMEND_COUNT' : 'keren-aanbevolen',
      'ATTEND_COUNT' : 'aantal-ik-ga',
      'COMMENT_COUNT' : 'aantal-commentaar',
      'PRIVATE' : 'prive',
      'AVAILABLEFROM' : 'datum-beschikbaar'
    }
  });
