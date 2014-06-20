myApp.factory("values", function() {
    return {
        match: function(xValues, yValues) {
            var scatData = [];
            xValues.values.forEach(function(d) {
                var y = _.find(yValues.values, function (x) {
                    return x.id === d.id;
                });
                if (y) {
                    var obj = {};
                    obj.value = d.value;
                    obj.y = y.value;
                    scatData.push(obj);
                }
            });
            return scatData;
        }
    }
});