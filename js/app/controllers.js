angular.module("FishCtrls", ["ngAnimate", "ui.bootstrap"])

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
                $scope.newPic.url = "";
                $scope.newPic.caption = "";
            } else {
                console.log("Problem creating new pic: ", res);
            }
        });
    };
}])

.controller("SpecificFishCtrl", ["$scope", function($scope) {
    $scope.fish = {
        fishpics: [],
        genus: {}
    };
}])

.controller("PairAddCtrl", ["$scope", "$http", function($scope, $http) {

}])

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
}]);