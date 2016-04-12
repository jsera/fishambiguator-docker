angular.module("FishCtrls", [])

.controller("EditCtrl", ["$scope", "$http", function($scope, $http) {
    $scope.fish = {
        fishpics:[]
    };

    $scope.ids = {};

    $scope.newPic = {};
    $scope.newPicDisabled = false;

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
        pic.btnDisabled = true;

        var req = {
            url: "/api/pictures/"+pic.id,
            method: "PUT",
            data: pic
        };

        $http(req).then(function(res) {
            pic.btnDisabled = false;
            if (res.status === 200) {
                pic.url = res.data.url;
                pic.caption = res.data.caption;
            } else {
                console.log("Problem updating pic", res);
            }
        });
    };

    $scope.deletePic = function($event, pic) {
        $event.preventDefault();
        pic.btnDisabled = true;
        var req = {
            url: "/api/pictures/"+pic.id,
            method: "DELETE"
        };

        $http(req).then(function(res) {
            pic.btnDisabled = false;
            if (res.status === 200) {
                $scope.fish.fishpics.splice($scope.fish.fishpics.indexOf(pic), 1);
                console.log("Deleted?");
            } else {
                console.log("Problem deleting pic: ", res);
            }
        });
    };

    $scope.addPic = function($event) {
        $event.preventDefault();
        $scope.newPicDisabled = true;

        $scope.newPic.fishId = $scope.fish.id;
        $scope.newPic.userId = $scope.ids.userId;

        var req = {
            url: "/api/pictures/",
            method: "POST",
            data: $scope.newPic
        };

        $http(req).then(function(res) {
            $scope.newPicDisabled = false;
            if (res.status === 200) {
                res.data.btnDisabled = false;
                $scope.fish.fishpics.push(res.data);
                console.log("New pic: "+res.data);
                $scope.newPicURL = "";
                $scope.newPicCaption = "";
            } else {
                console.log("Problem creating new pic: ", res);
            }
        });
    };
}]);