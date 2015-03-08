/// <reference name="~/Scripts/knockout-3.2.0.js" />
/// <reference name="~/Scripts/site/site.stock.js" />


var site = site || {};
site.components = site.components || {};

(function (stock) {

    (function (constants) {
        constants.optionType = {
            CALL: 0,
            PUT: 1
        };

        constants.tradeFee = 9.99;
        constants.optionContractFee = 0.75;

    })(stock.constants || (stock.constants = {}));

    stock.StockModel = function () {
        var self = this;
        self.name = ko.observable("");
        self.symbol = ko.observable("");
        self.lastPrice = ko.observable(0);
        self.open = ko.observable(0);
        self.high = ko.observable(0);
        self.low = ko.observable(0);
        self.changeYTD = ko.observable(0);

        self.markitLoad = function (markitJson) {
            self.name(markitJson.Name);
            self.symbol(markitJson.Symbol);
            self.lastPrice(markitJson.LastPrice);
            self.open(markitJson.Open);
            self.high(markitJson.High);
            self.low(markitJson.Low);
            self.changeYTD(markitJson.ChangeYTD);
        };
    };

    stock.OptionModel = function () {
        var self = this;
        self.symbol = ko.observable("");
        //self.enteredDate = ko.observable(); //date

        //entered
        self.optionType = ko.observable(stock.constants.optionType.CALL);
        self.expirationDate = ko.observable();  //date
        self.strikePrice = ko.observable(0.00); //currency
        self.optionPrice = ko.observable(0.00); //currency
        self.quantity = ko.observable(1);

        self.currentPrice = ko.observable(0.00);    //currency
        //self.stock = ko.observable(new stock.StockModel());

        self.exposed = ko.computed(function () {
            if (self.optionType() == stock.constants.optionType.CALL) {
                return self.currentPrice() * self.quantity() * 100;
            } else {
                return self.strikePrice() * self.quantity() * 100;
            }
        });

        self.breakEvenPrice = ko.computed(function () {
            if (self.optionType() == stock.constants.optionType.CALL) {
                return self.currentPrice() - self.optionPrice();
            } else {
                return self.strikePrice() - self.optionPrice();
            }
        });

        self.breakEvenVolatility = ko.computed(function () {
            return (self.breakEvenPrice() / self.currentPrice()) - 1;
        });

        self.expirationGain = ko.computed(function () {
            var expirationGain = self.optionPrice() * self.quantity() * 100;
            var optionCosts = self.quantity() * stock.constants.optionContractFee;

            var otherCosts = stock.constants.tradeFee;  //fee for trading options
            if (self.optionType() == stock.constants.optionType.CALL) {
                //additional fee for calls because you have to first buy the stock
                otherCosts += stock.constants.tradeFee;
            }


            return (expirationGain - optionCosts - otherCosts);
        });

        self.expirationGainPercentage = ko.computed(function () {
            return (self.expirationGain() / self.exposed());
        });

        self.strikeVolatility = ko.computed(function () {
            return (self.strikePrice() / self.currentPrice()) - 1;
        });

        //for calls only
        self.exercisedGain = ko.computed(function () {
            if (self.optionType() == stock.constants.optionType.CALL) {
                var expirationGain = self.expirationGain();
                var stockGain = (self.strikePrice() - self.currentPrice()) * self.quantity() * 100;
                var exerciseCosts = stock.constants.tradeFee;

                return (stockGain + expirationGain - exerciseCosts);
            }
            return 0;
        });

        self.exercisedGainPercentage = ko.computed(function () {
            if (self.optionType() == stock.constants.optionType.CALL) {
                return (self.exercisedGain() / self.exposed());
            }
            return 0;
        });


        self.toModel = function () {
            var model = {
                //OptionID: 0,
                OptionTypeID: self.optionType(),
                StockPrice: self.currentPrice(),
                StrikePrice: self.strikePrice(),
                OptionPrice: self.optionPrice(),
                Quantity: self.quantity(),
                ExpirationDate: self.expirationDate()
            }
            return model;
        };
    };

    (function (vm) {
        vm.boundedControlId = "";
        vm.currentStock = ko.observable(new stock.StockModel());
        vm.currentOption = ko.observable(new stock.OptionModel());
        vm.optionTypes = ko.observableArray([]);

        //ui
        vm.isRefreshing = ko.observable(false);
        vm.showSuccess = ko.observable(false);

        vm.init = function (controlId) {
            vm.boundedControlId = controlId;

            vm.optionTypes.push({
                key: "Call",
                value: stock.constants.optionType.CALL
            });
            vm.optionTypes.push({
                key: "Put",
                value: stock.constants.optionType.PUT
            });
            ko.applyBindings(vm, document.getElementById(vm.boundedControlId));
        };

        vm.getStock = function (symbol) {
            site.stock.getQuote(symbol, function (json) {
                vm.loadCurrentStock(json);
            });
        };

        vm.loadCurrentStock = function (markitJson) {
            vm.currentStock().markitLoad(markitJson);
        };

        vm.refreshCurrentStock = function () {
            vm.isRefreshing(true);
            site.stock.getQuote(vm.currentStock().symbol(), function (json) {
                vm.isRefreshing(false);
                vm.currentStock().markitLoad(json);
            });
        };

        //option functions
        vm.getOptionStock = function () {
            site.stock.getQuote(vm.currentOption().symbol(), function (json) {
                vm.loadCurrentStock(json);
                vm.currentOption().currentPrice(vm.currentStock().lastPrice());
            });
        };

        vm.cancelOption = function () {
            vm.currentOption(new stock.OptionModel());
        };

        vm.submitOption = function () {
            site.stock.submitOption(vm.currentOption().toModel(), function (result) {
                vm.showSuccess(true);
            });
        };


        //ui
        vm.dismissSuccess = function () {
            vm.showSuccess(false);
        }

    })(stock.vm || (stock.vm = {}));
})(site.components.stock || (site.components.stock = {}));