import { get_cart_len } from "../cart/cart.js";

(function () {
    'use strict'

    // check for empty cart --> redirect to home
    const cart_len = get_cart_len();
    if(cart_len === 0){
        window.location.href = '/';
        throw Error("Cart is Empty. Cannot checkout.");
    }

})()