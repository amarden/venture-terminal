myApp.controller("Main", function($scope, VentureService) {
    $scope.chosenX = "";
    $scope.chosenY = "";
    $scope.app = VentureService; // this object contains the methods that will be the go between for the client and venture, along with all the properties we are interested in storing.

    //Event Handlers
    $scope.submitLine = function(line) {
        $scope.app.sendCmd(line);
        $scope.cmdLine = "";
    };

    $scope.inferCont = function() {
        $scope.app.inferContinuous();
    };

    $scope.stopInfer = function() {
        $scope.app.stopInferContinuous();
    };

    $scope.changeX = function () {
        var data = _.find($scope.app.valueLog, function (d) { return d.id === $scope.chosenX });
        $scope.xData = data;
    };

    $scope.changeY = function() {
        var data = _.find($scope.app.valueLog, function(d) { return d.id === $scope.chosenY});
        $scope.yData = data;
    };
});

