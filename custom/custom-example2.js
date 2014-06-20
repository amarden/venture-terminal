myApp.directive("makeBarchart", function() {
    return {
        restrict: 'E',
        scope: {
            chartData: '='
        },
        template: '<div class="make-barchart"></div>',
        link: function (scope, ele) {
            //Create svg to put shapes on.
            var svg = d3.select("div.make-barchart")
                .append('svg')
                .style('width', '100%')
                .style('height', '100%');

            //Begin creating variables for my bar chart
            var width=300, height=200; // set the height and width I want for my histogram

            //create output scale to scale height of the bars in the histogram
            var y = d3.scale.linear()
                .range([height, 0])//output range, this is inverted because of how svg treats its y coordinates (y=0 is at the top of the svg)
                .domain([0,100]); //this is the input domain. We hard code these numbers because we know that we are only storing the last 100 values.

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

            var createAndUpdate = function (datapoints) {
                var convert = datapoints.values.map(function(d) {return d.value; }); //first need to transform data to get array of the history of values
                var group = _.groupBy(convert); //use underscore function to group values into arrays by their value, the array length becomes our count for each value
                var data = [];
                _.map(group, function(g, d){
                    var obj={};
                    obj.type = d;
                    obj.count = g.length;
                    data.push(obj);
                });

                x.domain(data.map(function(d) { return  d.type; })); //Map all the possible values
                //This is the bind, create, update, exit pattern in d3
                var bar = svg.selectAll("rect") //binding data
                    .data(data);

                bar.enter().append("rect") //create rectangles
                    .style("fill", "white");

                bar.transition() //updating rectangles that have data (adding transition for smooth changes)
                    .duration(10)
                    .attr("y", function(d) { return y(d.count); })
                    .attr("x", function(d) { return x(d.type);})
                    .attr("width", x.rangeBand())
                    .attr("height", function(d) { return height - y(d.count); });

                bar.exit().remove(); //remove rectangles that no longer have data
            };

            scope.$watch("chartData", function () {
                //make sure the object we want to use exists
                if(scope.chartData.yData) {
                    createAndUpdate(scope.chartData.yData); // Creating and Updating a Histogram based only on yData (right side radio buttons)
                }
            }, true);
        }
    }
});