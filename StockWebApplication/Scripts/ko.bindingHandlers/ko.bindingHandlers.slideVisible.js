ko.bindingHandlers.slideVisible = {
    update: function (element, valueAccessor, allBindings) {
        // First get the latest data that we're bound to
        var value = valueAccessor();
        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.utils.unwrapObservable(value);
        // Grab some more data from another binding property
        var duration = allBindings['slideDuration'] || 400;// 400ms is default duration unless otherwise specified

        // Now manipulate the DOM element
        if (valueUnwrapped == true) {
            // Make the element visible
            $(element).slideDown(duration);
        } else {
            // Make the element invisible
            $(element).slideUp(duration, function () {
                $(element).hide();
            });
        }

    }
};
