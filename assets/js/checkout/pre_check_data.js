import { add_product, get_cart_len } from "../cart/cart.js";

(function () {
    'use strict'

    // TODO: maybe change the way the color is recognized to the way it's done like the sizes
    // selected color
    let colorName;

    // Initialize colorName with the ID of the initially selected color div
    const initiallySelectedDiv = document.querySelector('.svg-selector .svg-selected');
    if (initiallySelectedDiv) {
        colorName = initiallySelectedDiv.parentElement.id;
    }

    // availability of "formular" (form) button 
    function check_for_form_btn() {
        const button = document.querySelector('.formular-btn');
        let cartLen = get_cart_len();
        if (cartLen > 0) {
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

        add_product(buttonId, size, colorName, quantity);
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
        window.location.href = '../../cart';
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

    // change the selected state of the color picker
    document.querySelectorAll('.svg-selector').forEach((div) => {
        div.addEventListener('click', (event) => {
            // Remove the 'svg-selected' class from all SVG elements
            document.querySelectorAll('.svg-selector svg').forEach((svgElement) => {
                svgElement.classList.remove('svg-selected');
                svgElement.classList.add('svg-hoverable');
            });

            // Add the 'svg-selected' class to the clicked SVG element's parent div
            div.querySelector('svg').classList.add('svg-selected');
            div.querySelector('svg').classList.remove('svg-hoverable');

            // Get the div ID (colorName)
            colorName = div.id;
            // console.log(colorName);
        });
    });




})()