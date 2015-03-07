/*
    Summary: Formats a date element using moment, optional parameter for masking
    Dependency: moment, jquery.maskedinput
*/

/*global ko,moment*/

ko.bindingHandlers.date = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var mask = allBindingsAccessor().maskDate || false;
        var maskString = "99/99/9999";
        if (mask) $(element).mask(maskString); //if mask is true
        ko.utils.registerEventHandler(element, "focusout", function () {
            var value = valueAccessor();
            if (mask) {
                //jquery mask sets the input value as the mask value with underscores
                var temp = $(element).val().replace(/#|_/g, '9').replace(maskString, '');
                if (temp === '') $(element).val(''); //if the value is equal to the default mask value then set it to blank
            }

            value($(element).val());
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor();
        var allBindings = allBindingsAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);

        // Date formats: http://momentjs.com/docs/#/displaying/format/
        var pattern = allBindings.format || 'MM/DD/YYYY';

        var output = value();
        try {
            var date = moment(value());
            if (date.isValid()) {
                output = date.format(pattern);
            }
        } catch (exc) {}

        if ($(element).is("input") === true) {
            $(element).val(output);
        } else {
            $(element).text(output);
        }
    }
};