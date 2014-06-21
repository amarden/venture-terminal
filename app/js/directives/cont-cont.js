myApp.directive("contCont", function(values) {
    return {
        restrict: 'E',
        scope: {
            chartData: '=',
            chartType: '='
        },
        template: '<div class="cont-cont-chart"></div>',
        link: function(scope, ele) {
            //D3 code to create scatter and histogram marginal chart
            var width = 310, height = 100, barHeight = 350, scatW = 275, scatH = 275;
            var svg = d3.select("div.cont-cont-chart")
                .append('svg')
                .style('width', '100%')
                .style('height', '100%');
            svg.append("g")
                .attr("class", "histo-x")
                .attr("transform", "translate(45,-320)");
            svg.append("g")
                .attr("class", "histo-y")
                .attr("transform", "translate(670,30) rotate(90)");
            var scatter = svg.append("g")
                .attr("width", scatW)
                .attr("height", scatH)
                .attr("transform", "translate(42,31)");

            var scatX = d3.scale.linear()
                .range([0,scatW]);

            var scatY = d3.scale.linear()
                .range([0,scatH]);

            var colorScale = d3.scale.linear()
                .domain([0,100])
                .range(["blue", "red"]);

            var x = d3.scale.linear()
                .range([0, 150]);

            var y = d3.scale.linear()
                .range([barHeight, 0])
                .domain([0,100]);

            // Next two functions for updating histo and scatter respectively
            var updateHisto =function(which, points) {
                var color = which === 'histo-x' ? 'rgb(255, 127, 0)' : 'rgb(255, 255, 51)';
                var convert = points.values.map(function(d) {return d.value; });
                x.domain([d3.min(convert, function(d) {return d}), d3.max(convert, function(d) { return d; })]);
                var data = d3.layout.histogram()
                    .bins(25)
                    (convert);
                debugger;
                var histogram = svg.select("."+which);
                var bar = histogram.selectAll(".bar")
                    .data(data);

                bar.enter().append("rect")
                    .style("fill", color)
                    .attr("class", "bar");

                bar.transition()
                    .duration(10)
                    .attr("y", function(d) { return y(d.y); })
                    .attr("x", function(d,i) { return i*11})
                    .attr("width", 10)
                    .attr("height", function(d) { return barHeight - y(d.y); });

                /*bar.exit().remove()*/
            };

            var updateScatter = function(xValues, yValues) {
                var scatData = values.match(xValues, yValues);

                scatX.domain([d3.min(scatData, function(d) {return d.value}), d3.max(scatData, function(d) { return d.value; })]);
                scatY.domain([d3.min(scatData, function(d) {return d.y}), d3.max(scatData, function(d) { return d.y; })]);

                var circles = scatter.selectAll("circle")
                    .data(scatData);

                circles.enter().append("circle")
                    .attr("r", 4)
                    .attr("cx", function(d) { return scatX(d.value)})
                    .attr("cy", function(d) { return scatY(d.y)});

                circles
                    .attr("cx", function(d) { return scatX(d.value)})
                    .attr("cy", function(d) { return scatY(d.y)})
                    .attr("fill" , function(d, i) { return colorScale(i);});

                circles.exit().remove();
            };

            //this watches for changes in the data adn updates the chart.
            //This may need to be changed as currently it only looks at one set of points
            scope.$watch("chartData", function() {
                if(scope.chartData.xData && scope.chartData.yData && scope.chartType==='cont-cont') {
                    updateHisto('histo-x', scope.chartData.xData);
                    updateHisto('histo-y', scope.chartData.yData);
                    updateScatter(scope.chartData.xData, scope.chartData.yData);
                }
            }, true);
        }
    }
});