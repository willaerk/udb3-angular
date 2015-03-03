'use strict';

/**
 * @ngdoc directive
 * @name udb.search.directive:udbQueryEditorField
 * @description
 * # udbQueryEditorField
 */
angular
  .module('udb.search')
  .directive('udbQueryEditorField', udbQueryEditorField);

/* @ngInject */
function udbQueryEditorField() {
  return {
    templateUrl: 'templates/query-editor-field.directive.html',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {

      function getParentGroup () {
        var parentGroup;

        if(isSubGroup()) {
          parentGroup = scope.$parent.field;
        } else {
          parentGroup = scope.rootGroup;
        }

        return parentGroup;
      }

      function getOperatorClass() {
        var operatorClass;
        if(isSubGroup() && scope.$index === 0) {
          operatorClass = 'AND';
        } else {
          operatorClass = scope.$index ? 'OR' : 'FIRST';
        }

        return operatorClass;
      }

      function isSubGroup() {
        var parentGroup = scope.$parent;
        return parentGroup.field.type === 'group';
      }

      scope.addField = function (index) {
        scope.qe.addField(getParentGroup(), index);
      };

      scope.removeField = function (index) {
        scope.qe.removeField(getParentGroup(), index);
      };

      scope.addSubGroup = function (index) {
        var rootGroup = scope.rootGroup,
          treeGroupId = _.uniqueId(),
            group = getParentGroup();

        group.treeGroupId = treeGroupId;

        if(isSubGroup()) {
          index = _.findIndex(rootGroup.nodes, function (group) {
            return group.treeGroupId === treeGroupId;
          });
        }

        scope.qe.addSubGroup(rootGroup, index);
      };

      scope.isSubGroup = isSubGroup;
      scope.getOperatorClass = getOperatorClass;
    }
  };
}