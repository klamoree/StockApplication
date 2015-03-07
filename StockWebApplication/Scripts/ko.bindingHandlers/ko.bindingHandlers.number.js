ko.bindingHandlers.toFixed = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var allBindings = allBindingsAccessor();

        var precision = allBindings.precision || 0;
        var eventType = allBindings.valueUpdate || 'change';

        ko.utils.registerEventHandler(element, eventType, function (event) {
            //get the value from the element
            if ($(element).is("input") === true) {
                value = $(element).val();
            } else {
                value = $(element).text();
            }

            if (value != null && value != "") {
                //round the number
                value = Number(value);
                value = Number(value.toFixed(precision));
            }

            //rewrite the rounded number
            if ($(element).is("input") === true) {
                $(element).val(value);
            } else {
                $(element).text(value);
            }

            //update the backing field
            valueAccessor()(value);
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var allBindings = allBindingsAccessor();
        var precision = allBindings.precision || 0;


        var value = valueAccessor();
        var unwrappedValue = ko.utils.unwrapObservable(value);
        var valToDisplay;

        //Ensure that we are only displaying 2 digits
        if (unwrappedValue || unwrappedValue === 0)
            valToDisplay = Number(unwrappedValue).toFixed(precision);
        else
            valToDisplay = '';

        //Update the UI
        if ($(element).is("input") === true) {
            $(element).val(valToDisplay);
        } else {
            $(element).text(valToDisplay);
        }
    }
};

ko.bindingHandlers.wrappedNumber = {
    negativeSymbol: ko.observable('-'),
    positiveSymbol: ko.observable('+'),
    suffix:ko.observable(''),
    update: function (element, valueAccessor, allBindingsAccessor) {
        return ko.bindingHandlers.text.update(element, function () {
            var value = +(ko.utils.unwrapObservable(valueAccessor()) || 0),
                negativeSymbol = ko.utils.unwrapObservable(allBindingsAccessor().negativeSymbol === undefined
                            ? ko.bindingHandlers.wrappedNumber.negativeSymbol
                            : allBindingsAccessor().negativeSymbol);
                positiveSymbol = ko.utils.unwrapObservable(allBindingsAccessor().positiveSymbol === undefined
                            ? ko.bindingHandlers.wrappedNumber.positiveSymbol
                            : allBindingsAccessor().positiveSymbol);
                suffix = ko.utils.unwrapObservable(allBindingsAccessor().suffix === undefined
                             ? ko.bindingHandlers.wrappedNumber.suffix
                             : allBindingsAccessor().suffix);
            var display = Math.abs(value);
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
            return display + suffix;
        });
    }
}






