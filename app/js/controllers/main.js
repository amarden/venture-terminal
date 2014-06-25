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
        $scope.app.startContinuousInference(line);
    };

    $scope.stopInfer = function() {
        $scope.app.stopContinuousInference();
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

    $scope.clear = function(directive) {
        $scope.app.forget(directive.directive_id);
    };

    $scope.openModal = function () {
        var modalInstance = $modal.open({
            templateUrl: 'app/views/modal.html',
            controller: 'Mod',
            resolve: {
                s: function () {
                    return $scope.app;
                }
            }
        });

        modalInstance.result.then(function (serverInfo) {
            $scope.app.serverName = serverInfo.server;
            $scope.app.serverPort = serverInfo.port;
        });
    };

    $scope.customShow = "";
    $scope.chartType="";
    $scope.chooseCustom = function(which) {
        $scope.customShow = which;
        console.log($scope.customShow);
    };

    $scope.$watch("graphData", function() {
        if($scope.graphData && $scope.graphData.xData && $scope.graphData.yData) {
            var distinctX = _.uniq($scope.graphData.xData.values.map(function(d) {return d.value; }));
            var distinctY = _.uniq($scope.graphData.yData.values.map(function(d) {return d.value; }));
            if((distinctY.length<10 || distinctX.length<10) && $scope.chartType!=='cont-disc') {
                $scope.chartType = "cont-disc";
            } else if((distinctY.length>10 && distinctX.length>10) && $scope.chartType!=='cont-cont') {
                $scope.chartType = "cont-cont";
            }
        }
    }, true);
});

myApp.controller("Mod", function($scope, $modalInstance, s) {
    $scope.thisMod = {};
    $scope.thisMod.server = s.serverName;
    $scope.thisMod.port = s.serverPort;

    $scope.ok = function () {
        var serverInfo = {};
        serverInfo.server = $scope.thisMod.server;
        serverInfo.port = $scope.thisMod.port;
        $modalInstance.close(serverInfo);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

