ko.components.register('stock-widget', {
    viewModel: function (params) {
        // Data: value is either null, 'like', or 'dislike'
        this.name = params.name;
        this.symbol = params.symbol;
        this.lastPrice = params.lastPrice;
        this.high = params.high;
        this.low = params.low;
        this.open = params.open;
    },
    template:
        '<div style="width: 400px; border: 1px solid #ddd; border-radius: 5px; margin: 15px; padding: 5px;">            \
            <table class="table">                                                                                       \
                <caption>                                                                                               \
                    <span data-bind="text: name"></span>&nbsp;-&nbsp;<span data-bind="text: symbol"></span>             \
                </caption>                                                                                              \
                <thead>                                                                                                 \
                    <tr>                                                                                                \
                        <td>Last Price</td>                                                                             \
                        <td>High</td>                                                                                   \
                        <td>Low</td>                                                                                    \
                        <td>Open</td>                                                                                   \
                    </tr>                                                                                               \
                </thead>                                                                                                \
                <tbody>                                                                                                 \
                    <tr>                                                                                                \
                        <td data-bind="text: lastPrice"></td>                                                           \
                        <td data-bind="text: high"></td>                                                                \
                        <td data-bind="text: low"></td>                                                                 \
                        <td data-bind="text: open"></td>                                                                \
                    </tr>                                                                                               \
                </tbody>                                                                                                \
            </table>                                                                                                    \
        </div>'
});