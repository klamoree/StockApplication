/*
    Link: https://github.com/grofit/knockout.tooltip
    Dependency: jquery.qtip (http://qtip2.com/download)
*/
ko.bindingHandlers.tooltip = {
    defaultTooltipOptions: {
        style: { classes: "qtip-custom qtip-custom-blue" },    //qtip-custom is in main.css
        position: { viewport: $(window) }
    },
    getBehaviour: function (bindings) {
        var behaviour = {};
        if (typeof bindings == "string") {
            behaviour.content = bindings;
        } else {
            behaviour.content = {
                text: bindings.content,
                title: { text: bindings.title }
            };
            behaviour = $.extend(behaviour, bindings.options);
        }
        return $.extend(ko.bindingHandlers.tooltip.defaultTooltipOptions, behaviour);
    },
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var allBindings = allBindingsAccessor();
        var tooltipBindings = allBindings.tooltip;
        var behaviour = ko.bindingHandlers.tooltip.getBehaviour(tooltipBindings);
        $(element).qtip(behaviour);
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var allBindings = allBindingsAccessor();
        var disabled = allBindings.tooltipDisabled === undefined ? false : allBindings.tooltipDisabled;
        if (disabled) {
            $(element).qtip("disable");
        } else {
            $(element).qtip("enable");
        }
    }
};