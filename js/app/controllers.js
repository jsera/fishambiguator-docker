angular.module("FishCtrls", [])

.controller("EditCtrl", ["$scope", "$http", function($scope, $http) {
    $scope.fish = {
        fishpics:[]
    };

    $scope.ids = {};

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

    $scope.updatePic = function($event, pic) {
        $event.preventDefault();
        console.log("This is the pic: ", pic);
    };

    $scope.deletePic = function($event, pic) {
        $event.preventDefault();
    };
}]);