/// <reference name="~/Scripts/knockout-3.2.0.js" />
/// <reference name="~/Scripts/components/site.components.stock.js" />

var site = site || {};
(function (stock) {
    stock.model = {};

    stock.init = function (model) {
        site.components.stock.vm.init("wow");
        site.stock.getQuote("SSTK", function (json) {
            site.components.stock.vm.loadCurrentStock(json);
        });
    };

    stock.getQuote = function (symbol, callback) {
        var baseUrl = "http://dev.markitondemand.com/Api/v2/Quote/jsonp?";
        var postUrl = baseUrl + "symbol=" + symbol;
        $.getJSON(postUrl + "&callback=?", function (json) {
            if (callback) {
                callback(json);
            }
        });
    };

    stock.submitOption = function (data, callback) {
        var url = window.submitOptionUrl;
        $.post(url, data, function (result) {
            if (callback) {
                callback(result);
            }
        });
    };
})(site.stock || (site.stock = {}));