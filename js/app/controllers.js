angular.module("FishCtrls", [])

.controller("EditCtrl", ["$scope", "$http", function($scope, $http) {
    $scope.fish = {};

    $scope.editNames = function($event) {
        $event.preventDefault();

        $scope.nameDisabled = true;

        var req = {
            url:"/api/fish/" + $scope.fish.id,
            method: "PUT",
            data: $scope.fish
        };

        $http(req).then(function(res) {
            $scope.nameDisabled = false;
            if (res.status === 200) {
            } else {
                console.log("Problem updating fish names:", res);
            }
        });
    };
}]);