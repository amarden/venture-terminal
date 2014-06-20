myApp.directive("makeHistogram", function() {
    return {
        restrict: 'E',
        scope: {
            chartData: '='
        },
        template: '<div class="make-histogram"></div>',
        link: function (scope, ele) {
            //Create svg to put shapes on.
            var svg = d3.select("div.make-histogram")
                .append('svg')
                .style('width', '100%')
                .style('height', '100%');

            //Begin creating variables for my histogram
            var width=300, height=200; // set the height and width I want for my histogram

            //create output scale to scale height of the bars in the histogram
            var y = d3.scale.linear()
                .range([height, 0])//output range, this is inverted because of how svg treats its y coordinates (y=0 is at the top of the svg)
                .domain([0,100]); //this is the input domain. We hard code these numbers because we know that we are only storing the last 100 values.

            var x = d3.scale.linear() // set output range for how much space all the bars will take up
                .range([0, width]);

            var alphaScale = d3.scale.linear() //set scale to show how to screw around with alpha blending see below for implementation
                .domain([0,25])
                .range([1, 0.2]);

            var createAndUpdate = function (datapoints) {
                var convert = datapoints.values.map(function(d) {return d.value; }); //first need to transform data to get array of the history of values;
                x.domain([d3.min(convert, function(d) { return d; }),d3.max(convert, function(d) { return d; })]); // set input domain for x scale (min and max of current values)
                var data = d3.layout.histogram() //this is d3's pattern to create a histogram layout
                    .bins(x.ticks(20))
                (convert);

                //This is the bind, create, update, exit pattern in d3
                var bar = svg.selectAll("rect") //binding data
                    .data(data);

                bar.enter().append("rect") //create rectangles
                    .style("fill", "white");

                bar.transition() //updating rectangles that have data (adding transition for smooth changes)
                    .duration(10)
                    .attr("y", function(d) { return y(d.y); })
                    .attr("x", function(d,i) { return i*15;})
                    .attr("width", 14)
                    .attr("height", function(d) { return height - y(d.y); })
                    .style("opacity", function(d) { return alphaScale(d.y)}); //the higher the bar the more transparent.

                bar.exit().remove(); //remove rectangles that no longer have data
            };

            scope.$watch("chartData", function () {
                //make sure the object we want to use exists
                if(scope.chartData.xData) {
                    createAndUpdate(scope.chartData.xData); // Creating and Updating a Histogram based only on xData (left side radio buttons)
                }
            }, true);
        }
    }
});