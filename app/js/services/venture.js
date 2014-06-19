//This "service" or object acts as the go-between for the client and Venture
myApp.factory("VentureService", function($http, $interval, parser) {
    var vs = {
        continuous: false,
        intervalHandler: {},
        commands: [],
        apiReturns: [],
        directives: [],
        assumes: [],
        valueLog:[],
        serverName:"localhost"
    };

    //Sends commands to the server and then gets directives
    //NOTE: not hooked up yet so currently the code comments out the ajax request
    vs.sendCmd = function(cmd) {
        this.commands.push(cmd); //done so we can implement a feature to use up arrow for previous command
        //$http.post("", cmd)
          //  .success(function(data) {
                    var data = {}; //temporary will remove
                    var complete = parser.api(data);
                    complete = {command: cmd, id:'#', value:'some value', error:'', success:true};
                    this.apiReturns.push(complete);
                    if(!this.continuous) {
                        this.getDirectives();
                    }
            //})
//            .error(function() {
//                console.log("Did not reach server");
//            });
    };

    // This method is dedicated to getting list directives, the method will get all directives, identify the 'assumes' so that we
    // can act on those parameters for the x and y choices in the chart. Ajax request commented out until we hook into server
    vs.getDirectives = function(that) {
        var handleAssumes = function(data) {
            //if(assumes.)
            data.forEach(function(d) {
                var exist = _.find(that.assumes, function(x) { return d.symbol === x.type});
                if(!exist) {
                    that.assumes.push({type: d.symbol});
                }
            });
        };

        // hack to change context to this object if not being called continuously
        if(this.hasOwnProperty("commands")){
          that = this;
        } else {
            console.log("Warning: context is out of whack")
        }
//        $http.post("list_directives")
//            .success(function(data) {
        // Next lines, rand1-3 adn data are just to emulate venture api response to client
                var rand1 = Math.random();
                var rand2 = Math.random();
                var rand3 = Math.random();
        var data = [{'symbol':'is_trick', 'instruction': 'assume', 'expression': ['bernoulli', {'type': 'number', 'value': 0.1}], 'directive_id': 1, 'value': rand1},
                    {'symbol':'weight', 'instruction': 'assume', 'expression': ['if', 'is_trick', ['uniform_continuous', {'type': 'number', 'value': 0.0}, {'type': 'number', 'value': 1.0}], {'type': 'number', 'value': 0.5}], 'directive_id': 2, 'value': rand2},
                    {'symbol':'w2', 'instruction': 'assume', 'expression': ['bernoulli', {'type': 'number', 'value': 0.1}], 'directive_id': 1, 'value': rand3}
                ]; //temp
                that.directives=parser.directive(data);
                handleAssumes(data);
                that.storeValues(data);
//            })
//            .error(function() {
//                console.log("Could not grab directives");
//            });
    };

    // This function keeps the last 100 values. Can make this dynamic if we want, for now hardcoded to 100
    vs.storeValues = function(data) {
        var that = this;
        // function for creating a new symbol-value log on valueLog array
        var createObj = function(data, unique_id) {
            that.valueLog.push({id: data.symbol, values:[{value: data.value, id: unique_id}]});
        };
        //uses timestamp as unique identifier to when the value was returned, used as a link between values for scatter plot
        var unique_id = +new Date();
        data.forEach(function(d) {
            var obj = _.find(that.valueLog, function(x) { return x.id === d.symbol});
            var toAdd = {value: d.value, id:unique_id};
            if(obj) {
                if(obj.values.length>100) {
                    obj.values.shift();
                }
                obj.values.push(toAdd)
            } else {
                createObj(d, unique_id);
            }
        });
    };

    vs.inferContinuous = function() {
        if(!this.continuous) {
            this.continuous = true;
            var that = this;
            var repeat = function() { vs.getDirectives(that); };
            this.intervalHandler = $interval(repeat, 50);
        }
    };

    vs.stopInferContinuous = function() {
        if(this.continuous) {
            this.continuous = false;
            $interval.cancel(this.intervalHandler);
        }
    };

    return vs;
});

