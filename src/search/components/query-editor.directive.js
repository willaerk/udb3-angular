'use strict';

/**
 * @ngdoc directive
 * @name udb.search.directive:udbQueryEditor
 * @description
 * # udbQueryEditor
 */
angular
  .module('udb.search')
  .directive('udbQueryEditor', udbQueryEditor);

/* @ngInject */
function udbQueryEditor(
  queryFields,
  LuceneQueryBuilder,
  taxonomyTerms,
  fieldTypeTransformers,
  searchHelper,
  $translate,
  $rootScope
) {
  return {
    templateUrl: 'templates/query-editor.directive.html',
    restrict: 'E',
    controllerAs: 'qe',
    link: function link(scope) {
      var queryBuilder = LuceneQueryBuilder;

      scope.$watch('activeQuery.groupedQueryTree', function (groupedQueryTree) {
        if (groupedQueryTree) {
          scope.qe.groupedQueryTree = groupedQueryTree;
        }
      }, true);
    },
    controller: function QueryEditor($scope) {
      var qe = this,
          queryBuilder = LuceneQueryBuilder;

      qe.fields = _.filter(queryFields, 'editable');

      // use the first occurrence of a group name to order it against the other groups
      var orderedGroups = _.chain(qe.fields)
        .map(function(field) {
          return field.group;
        })
        .uniq()
        .value();

      _.forEach(qe.fields, function (field) {
        var fieldName = field.name.toUpperCase(),
            fieldGroup = 'queryFieldGroup.' + field.group;

        $translate([fieldName, fieldGroup]).then(function (translations) {
          field.label = translations[fieldName];
          field.groupIndex = _.indexOf(orderedGroups, field.group);
          field.groupLabel = translations[fieldGroup];
        });
      });

      qe.operators = ['AND', 'OR'];
      qe.groupedQueryTree = {
        operator: 'OR',
        type: 'root',
        nodes: []
      };
      qe.colorScheme = ['rgb(141,211,199)', 'rgb(255,255,179)', 'rgb(190,186,218)', 'rgb(251,128,114)', 'rgb(128,177,211)', 'rgb(253,180,98)', 'rgb(179,222,105)', 'rgb(252,205,229)', 'rgb(217,217,217)', 'rgb(188,128,189)', 'rgb(204,235,197)'];

      // Holds options for both term and choice query-field types
      qe.transformers = {};
      qe.termOptions = _.groupBy(taxonomyTerms, function (term) {
        return 'category_' + term.domain + '_name';
      });
      _.forEach(queryFields, function (field) {
        if (field.type === 'choice') {
          qe.termOptions[field.name] = field.options;
        }
        qe.transformers[field.name] = fieldTypeTransformers[field.type];
      });

      /**
       * Update the search input field with the data from the query editor
       */
      qe.updateQueryString = function () {
        searchHelper.setQueryString(queryBuilder.unparseGroupedTree(qe.groupedQueryTree));
        $rootScope.$emit('stopEditingQuery');
      };

      qe.stopEditing = function () {
        $rootScope.$emit('stopEditingQuery');
      };

      /**
       * Add a field to a group
       *
       * @param {number}  groupIndex  The index of the group to add the field to
       */
      qe.addField = function (groupIndex) {
        var root = qe.groupedQueryTree;
        var group = root.nodes[groupIndex];

        var field = {
          field: 'title',
          term: '',
          fieldType: 'tokenized-string',
          transformer: '+'
        };

        group.nodes.push(field);

        if (group.nodes.length) {
          group.type = 'group';
        }
      };

      /**
       * Remove a field from a group
       *
       * @param {number}  groupIndex  The index of the group to delete a field from
       * @param {number}  fieldIndex  The index of the field to delete
       */
      qe.removeField = function (groupIndex, fieldIndex) {
        var root = qe.groupedQueryTree;
        var group = root.nodes[groupIndex];

        if (qe.canRemoveField()) {
          group.nodes.splice(fieldIndex, 1);
        }

        if (group.nodes.length < 2) {
          if (group.nodes.length) {
            group.type = 'field';
          } else {
            root.nodes.splice(groupIndex, 1);
          }
        }
      };

      /**
       * Check if a field can be removed without leaving a single empty group
       * @return {boolean}
       */
      qe.canRemoveField = function () {
        return !(qe.hasSingleGroup() && (qe.groupedQueryTree.nodes[0].nodes.length === 1));
      };

      /**
       * Add a field group
       */
      qe.addGroup = function () {
        var root = qe.groupedQueryTree;
        var group = {
          type: 'field',
          operator: 'OR',
          nodes: [
            {
              field: 'title',
              term: '',
              fieldType: 'tokenized-string',
              transformer: '+'
            }
          ]
        };

        root.nodes.push(group);
      };

      qe.updateFieldType = function (field) {
        var fieldName = field.field,
          queryField = _.find(queryFields, function (field) {
            return field.name === fieldName;
          });

        if (field.fieldType !== queryField.type) {
          // TODO: Maybe try to do a type conversion?
          if (queryField.type === 'date-range') {
            field.lowerBound = moment().startOf('day').toDate();
            field.upperBound = moment().endOf('day').toDate();
            field.inclusive = true;
          } else {
            field.term = '';
            field.lowerBound = undefined;
            field.upperBound = undefined;
            field.inclusive = undefined;
          }

          if (queryField.type === 'check') {
            field.term = 'TRUE';
          }

          if (queryField.type === 'number') {
            field.inclusive = true;
          }

          if (!field.transformer || !_.contains(fieldTypeTransformers[queryField.type], field.transformer)) {
            field.transformer = _.first(fieldTypeTransformers[queryField.type]);
          }

          field.fieldType = queryField.type;
        }
      };

      qe.hasSingleGroup = function () {
        return (qe.groupedQueryTree.nodes.length === 1);
      };
    }
  };
}
