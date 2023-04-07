import { add_product, del_product } from "/assets/js/cart/cart.js";

(function () {
    'use strict'

    // save current product to cart 
    document.querySelector('.formular-btn').addEventListener('click', (e) => {
        // get button id for product id
        const buttonId = Number(e.target.id);
        add_product(buttonId);
        window.location.href = '/checkout';
    });

})()