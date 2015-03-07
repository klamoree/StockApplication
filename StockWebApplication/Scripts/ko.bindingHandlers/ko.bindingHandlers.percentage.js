ko.bindingHandlers.percentage = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        return ko.bindingHandlers.text.update(element, function () {
            var value = parseFloat(ko.utils.unwrapObservable(valueAccessor()) || 0);    //parse value
            var invalidSymbol = ko.utils.unwrapObservable(allBindingsAccessor().invalidSymbol === undefined ? null : allBindingsAccessor().invalidSymbol);
            var precision = allBindingsAccessor().precision || 2;
            if (value <= 1 && value >= -1) {
                value = value * 100; //if its a decimal, convert to percentage
            }
            if (!$.isNumeric(value)) {
                if (invalidSymbol) {
                    return invalidSymbol;
                }
                value = 0;
            }

            var allBindings = allBindingsAccessor();

            var percentageSuffix = allBindings.percentageSuffix || '%';
            if (allBindings.hidePercentSign) {
                percentageSuffix = '';
            }

            return value.toFixed(precision) + percentageSuffix;
        });
    }
};



ko.bindingHandlers.percentageValue = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var allBindings = allBindingsAccessor();

        var percentageSuffix = allBindings.percentageSuffix || '%';
        if (allBindings.hidePercentSign) {
            percentageSuffix = '';
        }

        /**create a computed to handle displaying a percentage value while keeping the internal value as a decimal  */
        var computedValue = ko.computed({
            read: function () {
                var val = parseFloat(ko.utils.unwrapObservable(valueAccessor()));
                if (isNaN(val)) {
                    if (allBindingsAccessor().NaNDefault) {
                        return allBindingsAccessor().NaNDefault;
                    } else {
                        return "NaN" + percentageSuffix;
                    }
                }
                var precision = allBindingsAccessor().precision * 1 || 2;
                val = val * 100;
                var round = val.toFixed(precision);
                var formattedValue = String(round) + percentageSuffix;
                return formattedValue;
            },
            write: function (newValue) {
                /**Save value as a decimal */
                var val = parseFloat(newValue);
                if (isNaN(val) || val <= 0) {
                    valueAccessor()(0);
                    valueAccessor().valueHasMutated();
                } else {
                    var precision = allBindingsAccessor().precision * 1 || 2;
                    val = val / 100;
                    valueAccessor()(val);
                    valueAccessor().valueHasMutated();
                }
            }
        });
        ko.applyBindingsToNode(element, {
            'value': computedValue
        }, viewModel);
    }
};