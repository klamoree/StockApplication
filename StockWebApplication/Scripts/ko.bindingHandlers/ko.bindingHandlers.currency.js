/*
    Summary: Formats text as currency. Optional parameters for symbol (default: $) and negativeSymbol (default: -)
    Dependency: none
*/

ko.bindingHandlers.currency = {
    symbol: ko.observable('$'),
    negativeSymbol: ko.observable('-'),
    positiveSymbol: ko.observable(''),
    invalidSymbol: ko.observable(''),
    update: function (element, valueAccessor, allBindingsAccessor) {
        return ko.bindingHandlers.text.update(element, function () {
            var value = +(ko.utils.unwrapObservable(valueAccessor()) || 0),
                symbol = ko.utils.unwrapObservable(allBindingsAccessor().symbol === undefined
                            ? ko.bindingHandlers.currency.symbol
                            : allBindingsAccessor().symbol),
                negativeSymbol = ko.utils.unwrapObservable(allBindingsAccessor().negativeSymbol === undefined
                            ? ko.bindingHandlers.currency.negativeSymbol
                            : allBindingsAccessor().negativeSymbol),
                positiveSymbol = ko.utils.unwrapObservable(allBindingsAccessor().positiveSymbol === undefined
                            ? ko.bindingHandlers.currency.positiveSymbol
                            : allBindingsAccessor().positiveSymbol),
                invalidSymbol = ko.utils.unwrapObservable(allBindingsAccessor().invalidSymbol === undefined
                            ? ko.bindingHandlers.currency.invalidSymbol
                            : allBindingsAccessor().invalidSymbol);
            if (!$.isNumeric(value)) {
                //invalid number
                return invalidSymbol;
            }
            var display = symbol + Math.abs(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            if (value < 0) {
                switch (negativeSymbol) {
                    case '()':
                        display = "(" + display + ")"; break;
                    case '-':
                    default:
                        display = "-" + display; break;

                }

            }
            else {
                display = positiveSymbol + display;
            }
            return display;
        });
    }
};