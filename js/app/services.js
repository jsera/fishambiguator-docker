angular.module("FishServices", [])

.service("PairService", [function() {
    var self = this;
    this.listeners = [];
    this.currentPairs = {};

    function dispatchPair() {
        self.listeners.forEach(function(listener) {
            listener(self.currentPairs);
        });
    }

    this.addListener = function(listener) {
        this.listeners.push(listener);
    };

    this.removeListener = function(listener) {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    };

    this.setPairID = function(senderID, fishID) {
        this.currentPairs[senderID] = fishID;
        dispatchPair();
    };

    this.unsetPair = function(senderID) {
        this.currentPairs[senderID] = null;
        dispatchPair();
    };
}]);