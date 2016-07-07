angular.module("CommentEditor", [])

.controller("CommentEditCtrl", ["$scope", "$http", function($scope, $http) {

}])

.directive("commentEditor", function() {
    return {
        restrict: "E",
        templateUrl: "tpl-comment-editor",
        controller: "CommentEditCtrl",
        scope: {

        }
    };
});