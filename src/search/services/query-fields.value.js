'use strict';

/**
 * @ngdoc service
 * @name udb.search.queryFields
 * @description
 * Query field types:
 * - string
 * - string
 * - choice
 * - check
 * - date-range
 * - term
 *
 * When displayed in the editor, the first occurrence of a group name will determine its order in relation to the other
 * groups.
 */
angular
  .module('udb.search')
  .value('queryFields', [
    {name: 'category_name', type: 'term', group: 'what'},
    {name: 'cdbid', type: 'string', group: 'what'},
    {name: 'keywords', type: 'string', group: 'what'},
    {name: 'title', type: 'tokenized-string', group: 'what'},
    {name: 'externalid', type: 'string', group: 'what'},
    {name: 'category_eventtype_name', type: 'term', group: 'what'},
    {name: 'category_theme_name', type: 'term', group: 'what'},

    {name: 'city', type: 'string', group:'where'},
    {name: 'zipcode', type: 'string', group:'where'},
    {name: 'country', type: 'choice', group:'where', options: ['AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'UM', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'YE', 'YT', 'ZA', 'ZM']},
    {name: 'location_label', type: 'tokenized-string', group:'where'},
    {name: 'category_flandersregion_name', type: 'term' , group:'where'},
    {name: 'physical_gis', type: 'string', group:'where'},

    {name: 'startdate', type: 'date-range', group:'when'},
    {name: 'enddate', type: 'date-range', group:'when'},
    {name: 'permanent', type: 'check', group:'when'},

    {name: 'lastupdated', type: 'date-range', group:'input-information'},
    {name: 'lastupdatedby', type: 'string', group:'input-information'},
    {name: 'creationdate', type: 'date-range', group:'input-information'},
    {name: 'createdby', type: 'string', group:'input-information'},
    {name: 'availablefrom', type: 'date-range', group:'input-information'},

    {name: 'detail_lang', type: 'choice', group:'translations', options: ['nl', 'fr', 'en', 'de']},

    {name: 'organiser_keywords', type: 'string', group: 'other'},
    {name: 'agefrom', type: 'number', group: 'other'},
    {name: 'price', type: 'number' , group: 'other'},
    {name: 'organiser_label', type: 'tokenized-string', group: 'other'},
    {name: 'category_facility_name', type: 'term', group: 'other'},
    {name: 'category_targetaudience_name', type: 'term', group: 'other'},
    {name: 'category_publicscope_name', type: 'term', group: 'other'},
    {name: 'private', type: 'check', group: 'other'}
  ]);
