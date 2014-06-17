myApp.factory("parser", function() {
    return {
        //This will contain function to parse list_directives and return as array for model
        directive: function(data) {
            var directives = [];
            data.forEach(function(d){
                directives.push({text: d.instruction.toUpperCase()+" "+ d.symbol+" "+d.value, value: d.value, symbol: d.symbol });
            });
            return directives;
        },
        api: function(data) {
            //do something with data
            return data;
        }
    };
});
