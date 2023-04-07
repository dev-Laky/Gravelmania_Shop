import { check_for_localstorage } from "/assets/js/cart/cart.js";

(function () {
    'use strict'

    check_for_localstorage();
    // check for empty cart --> redirect to home
    const shop_cart = JSON.parse(localStorage.getItem('shop_cart'));
    if(shop_cart.cart.length === 0){
        window.location.href = '/';
        throw Error("Cart is Empty. Cannot checkout.");
    }

})()