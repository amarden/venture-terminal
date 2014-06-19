myApp.directive("contDisc", function() {
    return {
        restrict: 'E',
        scope: {
            chartData:'='
        },
        template: '<div class="cont-disc-chart"></div>',
        link: function(scope, ele) {


            var svg = d3.select("div.cont-disc-chart")
                .append('svg')
                .style('width', '100%')
                .style('height', '100%');
            var top = svg.append("g")
                .attr("class", "top-half")
                .attr("transform", "translate(0,0)")
                .style('width', '100%')
                .style('height', '50%');
            var bottom = svg.append("g")
                .attr("class", "bottom-half")
                .attr("transform", "translate(0,0)")
                .style('width', '100%')
                .style('height', '50%');
        }
    }
});