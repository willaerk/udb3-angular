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
 */
angular
  .module('udb.search')
  .value('queryFields', [
    {name: 'cdbid', type: 'string'},
    {name: 'title', type: 'tokenized-string'},
    {name: 'keywords', type: 'string'},
    {name: 'organiser_keywords', type: 'string'},
    {name: 'city', type: 'string'},
    {name: 'zipcode', type: 'string'},
    {name: 'country', type: 'choice', options: ['AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'UM', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'YE', 'YT', 'ZA', 'ZM']},
    {name: 'physical_gis', type: 'string'},
    {name: 'category_name', type: 'term'},
    {name: 'agefrom', type: 'number'},
    {name: 'detail_lang', type: 'choice', options: ['nl', 'fr', 'en', 'de']},
    {name: 'price', type: 'number'},
    {name: 'startdate', type: 'date-range'},
    {name: 'enddate', type: 'date-range'},
    {name: 'organiser_label', type: 'tokenized-string'},
    {name: 'location_label', type: 'tokenized-string'},
    {name: 'externalid', type: 'string'},
    {name: 'lastupdated', type: 'date-range'},
    {name: 'lastupdatedby', type: 'string'},
    {name: 'creationdate', type: 'date-range'},
    {name: 'createdby', type: 'string'},
    {name: 'permanent', type: 'check'},
    {name: 'category_eventtype_name', type: 'term'},
    {name: 'category_theme_name', type: 'term'},
    {name: 'category_facility_name', type: 'term'},
    {name: 'category_targetaudience_name', type: 'term'},
    {name: 'category_flandersregion_name', type: 'term'},
    {name: 'category_publicscope_name', type: 'term'},
    {name: 'like_count', type: 'number'},
    {name: 'recommend_count', type: 'number'},
    {name: 'attend_count', type: 'number'},
    {name: 'comment_count', type: 'number'},
    {name: 'private', type: 'check'},
    {name: 'availablefrom', type: 'date-range'}
  ]);
