/*
    Summary: Adds a jquery ui datepicker to input field
    Link: http://stackoverflow.com/questions/6612705/jquery-ui-datepicker-change-event-not-caught-by-knockoutjs, http://jsfiddle.net/rniemeyer/NAgNV/
    Dependency: jquery.ui, moment
*/

/*global ko,moment*/

ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var options = {}
        if (allBindingsAccessor().datepickerOptions) {
            options = ko.mapping.toJS(allBindingsAccessor().datepickerOptions) || {};
        }

        $(element).datepicker(options);

        //handle the field changing
        ko.utils.registerEventHandler(element, "change", function () {
            var observable = valueAccessor();
            observable($(element).datepicker("getDate"));
        });

        //handle disposal (if KO removes by the template binding)
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).datepicker("destroy");
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        //$el = $(element);

        var options = {}
        if (allBindingsAccessor().datepickerOptions) {
            options = ko.mapping.toJS(allBindingsAccessor().datepickerOptions) || {};
        }
        //var options = ko.mapping.toJS(allBindingsAccessor().datepickerOptions) || {};
        $(element).datepicker("option", options);

        //handle date data coming via json from Microsoft
        if (String(value).indexOf('/Date(') == 0) {
            value = new Date(parseInt(value.replace(/\/Date\((.*?)\)\//gi, "$1")));
        }
        if (value) {
            value = moment(value);

            var current = $(element).datepicker("getDate");

            if (value.isValid() && value.toDate() - current !== 0) {
                $(element).datepicker("setDate", value.toDate());
                $(element).val(value.format("MM/DD/YYYY")); //the element should already be set to this value unless it is less than the mindate
            }
        }
    }
};