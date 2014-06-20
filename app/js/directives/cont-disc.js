myApp.directive("contDisc", ['values', function(values) {
    return {
        restrict: 'E',
        scope: {
            chartData:'=',
            chartType:'='
        },
        template: '<div class="cont-disc-chart"></div>',
        link: function(scope) {
            var topDimensions = {
                w: 300,
                y:-50,
                h:150
            };
            var botDimensions = {
                w:100,
                h:200,
                x:120
            };
            var svg = d3.select("div.cont-disc-chart")
                .append('svg')
                .style('width', '100%')
                .style('height', '100%');
            var top = svg.append("g")
                .attr("class", "top-half")
                .attr("transform", "translate(0,"+topDimensions.y+")")
                .style('width', '100%')
                .style('height', '50%');
            var bottom = svg.append("g")
                .attr("class", "bottom-half")
                .attr("transform", "translate(0,50)")
                .style('width', '100%')
                .style('height', '50%');
            top.append("g")
                .attr("class", "histogram");
            var barG = top.append("g")
                .attr("class", "bar")
                .attr("transform", "translate("+topDimensions.w+",0)");
            var xBar = d3.scale.ordinal()
                .rangeRoundBands([0,topDimensions.w], .1);
            var xHistTop =  d3.scale.linear()
                .range([0, topDimensions.w]);
            var yTop = d3.scale.linear()
                .range([topDimensions.h,0])
                .domain([0,50]);
            var yBot = d3.scale.linear()
                .range([botDimensions.h,0])
                .domain([0,25]);
            var xHistBot =  d3.scale.linear()
                .range([0, botDimensions.w]);
            var count=0;

            var updateHisto =function(which, points, yScale, xScale, dimension) {
                var color = 'rgb(255, 127, 0)';
                var convert = points.map(function(d) {return d.value; });
                var data = d3.layout.histogram()
                    .bins(xScale.ticks(20))
                (convert);

                var s = dimension.w/20;

                var histogram = svg.select("."+which);
                var rect = histogram.selectAll(".bar")
                    .data(data);

                rect.enter().append("rect")
                    .style("fill", color)
                    .attr("class", "bar");

                rect.transition()
                    .duration(10)
                    .attr("y", function(d) { return yScale(d.y); })
                    .attr("x", function(d,i) { return i*s;})
                    .attr("width", s-1)
                    .attr("height", function(d) { return dimension.h - yScale(d.y); });

                rect.exit().remove();
            };

            var updateTop = function(cont, disc) {
                var contValues = cont.values;
                updateHisto("histogram", contValues, yTop, xHistTop, topDimensions);
                var convert = disc.values.map(function(d) {return d.value; });
                var group = _.groupBy(convert);
                var data = [];
                _.map(group, function(g, d){
                    var obj={};
                    obj.type = d;
                    obj.count = g.length;
                    data.push(obj);
                });

                xBar.domain(data.map(function(d) { return  d.type; })); //Map all the possible values
                //This is the bind, create, update, exit pattern in d3
                var bar = barG.selectAll("rect") //binding data
                    .data(data);

                bar.enter().append("rect") //create rectangles
                    .style("fill", "white");

                bar.transition() //updating rectangles that have data (adding transition for smooth changes)
                    .duration(10)
                    .attr("y", function(d) { return yTop(d.count); })
                    .attr("x", function(d) { return xBar(d.type);})
                    .attr("width", xBar.rangeBand())
                    .attr("height", function(d) { return topDimensions.h - yTop(d.count); });

                bar.exit().remove(); //remove rectangles that no longer have data

                var label = barG.selectAll("text") //binding data
                    .data(data);

                label.enter().append("text") //create rectangles
                    .style("fill", "white");

                label.attr("x", function(d) { return xBar(d.type) + xBar.rangeBand()/2})
                    .attr("y", 70)
                    .text(function(d) { return d.type; });

                label.exit().remove(); //remove rectangles that no longer have data
            };

            var updateBottom = function(data) {
                data.forEach(function(d) {
                    var name = "histo"+d[0].y;
                    var exist = d3.select("g."+name);
                    if(!exist[0][0]) {
                        var moveY = Math.floor(count/5);
                        var moveX = count > 4 ? count-5 : count;
                        console.log(moveX);
                        var botContainer = bottom.append("g")
                            .attr("class", name)
                            .attr("height", botDimensions.h)
                            .attr("width", botDimensions.w)
                            .attr("transform", "translate("+(moveX*botDimensions.x)+","+(-50+(moveY*100))+")");
                        botContainer.append("text")
                            .attr("fill", "white")
                            .attr("y", 150)
                            .attr("x", botDimensions.w/2)
                            .style("text-anchor", "middle")
                            .text("Filtered on "+d[0].y);
                        count++;
                    }
                    updateHisto(name,d,yBot,xHistBot, botDimensions);
                });
            };

            scope.$watch("chartData", function() {
                if(scope.chartData.xData && scope.chartData.yData && scope.chartType==='cont-disc') {
                    var x = scope.chartData.xData.values.map(function(d) {return d.value; });
                    var y = scope.chartData.yData.values.map(function(d) {return d.value; });
                    if(x.length>50 && y.length>50) {
                        var disc, cont;
                        var distinctX = _.uniq(scope.chartData.xData.values.map(function(d) {return d.value; }));
                        var distinctY = _.uniq(scope.chartData.yData.values.map(function(d) {return d.value; }));
                        if(distinctY.length<10) {
                            disc = scope.chartData.yData;
                            cont = scope.chartData.xData;
                        } else if(distinctX.length<10) {
                            disc = scope.chartData.xData;
                            cont = scope.chartData.yData;
                        }

                        var combined = values.match(cont, disc);
                        var filtered = [];
                        _.uniq(_.pluck(disc.values, "value")).forEach(function(d) {
                            filtered[d] = _.filter(combined, function(x) { return x.y=== d; });
                        });
                        updateTop(cont, disc);
                        updateBottom(filtered);
                    }
                }
            }, true);
        }
    }
}]);