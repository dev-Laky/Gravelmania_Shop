import { add_product, del_product } from "/assets/js/cart/cart.js";

(function () {
    'use strict'

    // save current product to cart 
    document.querySelector('.formular-btn').addEventListener('click', (e) => {
        add_product(1);
        window.location.href = '/checkout';
    });

})()