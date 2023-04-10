import { render_priceList, render_price_total, render_price_product } from "/assets/js/cart_checkout/price_list.js"

(function () {
    "use strict";

    function render() {

        // render products
        render_priceList("checkout");

        // render price
        render_price_total();
        render_price_product();

    }

    // render all "sections" on page-load
    render();

})();