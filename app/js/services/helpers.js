var exprToString = function(expr) {
    //console.log(typeof expr);
    if (expr instanceof Array) {
        return "(" + expr.map(exprToString).join(" ") + ")";
    } else if (typeof expr === "string") {
        return expr;
    } else {
        return expr.value.toString();
    }
};

var directiveToString = function(directive) {
    var directive_str = "[" + directive.instruction + " ";

    if (directive.instruction === "assume") {
        directive_str += directive.symbol + " ";
    }

    directive_str += exprToString(directive.expression);

    if (directive.instruction === "observe") {
        directive_str += " " + directive.value;
    }

    directive_str += "]";
    return directive_str;
};

myApp.factory("parser", function() {
    return {
        unparse: function(directive) {
            return {
              symbol: directive.symbol,
              instruction: directive.instruction,
              expression: exprToString(directive.expression),
              text: directiveToString(directive),
              value: directive.value
            };
        },
        api: function(data) {
            //do something with data
            return data;
        }
    };
});

