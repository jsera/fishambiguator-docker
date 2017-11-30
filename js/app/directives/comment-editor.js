angular.module("CommentEditor", [])

.controller("CommentEditCtrl", ["$scope", "$http", function($scope, $http) {
    // Just load all comments for this fish pair. The backend will take care of reciprocal pairs
    // If we get comments, display them. All comments by this editor are editable.
    // No comments means the pair doesn't exist. Just display a new comment form
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