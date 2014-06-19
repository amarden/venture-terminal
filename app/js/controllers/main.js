myApp.controller("Main", function($scope, VentureService, $modal) {
    $scope.chosenX = "";
    $scope.chosenY = "";
    $scope.app = VentureService; // this object contains the methods that will be the go between for the client and venture, along with all the properties we are interested in storing.
    $scope.graphData = {};

    //Event Handlers
    $scope.submitLine = function(line) {
        $scope.app.sendCmd(line);
        $scope.cmdLine = "";
    };

    $scope.inferCont = function(line) {
        console.log(line);
        $scope.app.inferContinuous();
    };

    $scope.stopInfer = function() {
        $scope.app.stopInferContinuous();
    };

    $scope.changeX = function () {
        var data = _.find($scope.app.valueLog, function (d) { return d.id === $scope.chosenX });
        $scope.graphData.xData = data;
    };

    $scope.changeY = function() {
        var data = _.find($scope.app.valueLog, function(d) { return d.id === $scope.chosenY});
        $scope.graphData.yData = data;
    };

    $scope.freeze = function(item) {
        console.log(item);
        //$scope.app.sendCmd("Freeze...")
    };

    $scope.clear = function(item) {
        console.log(item);
        //$scope.app.sendCmd("Clear...")
    };

    $scope.openModal = function () {
        var modalInstance = $modal.open({
            templateUrl: 'app/views/modal.html',
            controller: 'Mod',
            resolve: {
                name: function () {
                    return $scope.app.serverName;
                }
            }
        });

        modalInstance.result.then(function (serverName) {
            console.log(serverName);
            $scope.app.serverName = serverName;
            console.log($scope);
        });
    };
});

myApp.controller("Mod", function($scope, $modalInstance, name) {
    $scope.thisMod = {};
    $scope.thisMod.server = name;

    $scope.ok = function () {
        $modalInstance.close($scope.thisMod.server);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

