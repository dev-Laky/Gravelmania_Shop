import { add_product, get_cart_len } from "../cart/cart.js";

(function () {
    'use strict'

    // availability of "formular" (form) button 
    function check_for_form_btn() {
        const button = document.querySelector('.formular-btn');
        let cartLen = get_cart_len();
        if(cartLen > 0){
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    }

    check_for_form_btn();

    function pre_save_data(event) {
        // get button id for product id
        const buttonId = Number(event.target.id);

        // check which radio (size) is checked
        let size;
        // Get all radio buttons with name "options"
        const radioButtons = document.getElementsByName("options");

        // Loop through each radio button
        for (let i = 0; i < radioButtons.length; i++) {
            // Check if radio button is checked
            if (radioButtons[i].checked) {
                // If checked, get the label text
                const labelText = radioButtons[i].nextElementSibling.textContent;
                size = labelText.trim();
            }
        }

        // read form-control input --> quantity
        // Get the input element by its ID
        const inputQuantity = document.querySelector('#inputQuantity');

        // Get the value of the input element
        const quantity = Number(inputQuantity.value);

        add_product(buttonId, size, quantity);
    }

    // save current product to cart 
    document.querySelector('.add-cart-btn').addEventListener('click', (event) => {
        pre_save_data(event);
        // enable form-btn, but wait for cart length to change 
        setTimeout(check_for_form_btn, 100);
    });

    // save current product to cart, go to checkout
    document.querySelector('.formular-btn').addEventListener('click', (event) => {
        // pre_save_data(event);
        window.location.href = '../../../cart';
    });

    // avoid letter input to form-control --> quantity
    // Add an event listener to the input field
    document.querySelector('#inputQuantity').addEventListener('input', (event) => {
        // Get the current input value
        const inputValue = event.target.value;

        // Remove any non-numeric characters from the input value
        const numericValue = inputValue.replace(/[^0-9]/g, '');

        // Update the input field value with the numeric value
        event.target.value = numericValue;
    });

})()