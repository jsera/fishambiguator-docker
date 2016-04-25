angular.module("FishDirectives", ["ngAnimate", "ui.bootstrap"])

.controller("FishFindCtrl", ["$scope", "$http", function($scope, $http) {
    $scope.commonname = "";
    $scope.binomialname = "";
    $scope.loadingFish = false;
    $scope.noResults = false;
    $scope.loadingBinomial = false;
    $scope.noBinomialResults = false;
    $scope.noFishFound = false;
    $scope.fishFound = false;
    $scope.fish = {};

    var formatNames = function(fish) {
        fish.binomialName = fish.genus.name + " " + fish.species;
        fish.formattedCommonNames = fish.commonnames.split(",").join(", ");
        return fish;
    };

    $scope.autocompleteCommonName = function(query) {
        var req = {
            method: "GET",
            url: "/api/fish/autocomplete",
            params:{
                q:query
            }
        };

        return $http(req).then(function(res){
            if (res.data.map) {
                return res.data.map(function(fish) {
                    return fish.namematch;
                });
            } else {
                return [];
            }
        });
    };

    $scope.autocompleteBinomial = function(query) {
        var req = {
            method: "GET",
            url: "/api/genus/autocomplete",
            params:{
                q:query
            }
        };

        return $http(req).then(function(res) {
            if (res.data.map) {
                return res.data.map(function(fish) {
                    return fish.genus.name + " " + fish.species;
                });
            } else {
                return [];
            }
        });
    };

    $scope.searchByCommonName = function($event) {
        $event.preventDefault();
        $scope.fish = null;
        $scope.fishFound = false;
        var req = {
            method: "GET",
            url: "/api/fish",
            params: {
                commonname: $scope.commonname
            }
        };

        $http(req).then(function(res) {
            if (res.data.results && res.data.results.join) {
                $scope.fishFound = !($scope.noFishFound = false);
                $scope.fish = formatNames(res.data.results[0]);
            } else {
                $scope.fishFound = !($scope.noFishFound = true);
            }
        }, function(res) {
            $scope.fishFound = !($scope.noFishFound = true);
        });
    };

    $scope.searchByBinomial = function($event) {
        $event.preventDefault();
        $scope.fish = null;
        $scope.fishFound = false;
        var req = {
            method: "GET",
            url: "/api/fish",
            params: {
                scientificname: $scope.binomialname
            }
        };

        $http(req).then(function(res) {
            if (res.data.results && res.data.results.join) {
                $scope.fishFound = !($scope.noFishFound = false);
                $scope.fish = formatNames(res.data.results[0]);
            } else {
                $scope.fishFound = !($scope.noFishFound = true);
            }
        }, function(res) {
            $scope.fishFound = !($scope.noFishFound = true);
        });
    };
}])

.directive("fishFinder", function() {
    return {
        templateUrl: "tpl-fish-finder",
        controller: "FishFindCtrl"
    };
});