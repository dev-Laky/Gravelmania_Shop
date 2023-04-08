import { del_product } from "/assets/js/cart/cart.js";
(function () {
    "use strict";

    // global total price
    let totalPrice = 0;

    function render_products() {

        const cartItemsDiv = document.getElementById('cart-items');
        // clear previous content in the div (products) --> start new rendering
        cartItemsDiv.innerHTML = "";
        const cartData = JSON.parse(localStorage.getItem('shop_cart'));

        if (cartData && cartData.cart && cartData.cart.length > 0) {
            cartData.cart.forEach(item => {
                // sum up price
                totalPrice += item.price;

                const productDiv = document.createElement('div');
                productDiv.classList.add('row', 'd-flex', 'justify-content-between', 'align-items-center');
                productDiv.innerHTML = `
        <div class="col-md-2 col-lg-2 col-xl-2">
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img7.webp" class="img-fluid rounded-3" alt="${item.name}">
        </div>
        <div class="col-md-3 col-lg-3 col-xl-3">
          <h6 class="text-muted">Größe ${item.size}</h6>
          <h6 class="text-black mb-0">${item.name}</h6>
        </div>
        <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
          <h6 class="mb-0">${item.quantity} Mal</h6>
        </div>
        <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
          <h6 class="mb-0">€ ${item.price}</h6>
        </div>
        <div class="col-md-1 col-lg-1 col-xl-1 text-end">
          <button id="${item.id}" class="btn del-cart-btn"><i class="bi bi-trash text-danger"></i></button>
        </div>
        <hr class="my-4">
      `;
                cartItemsDiv.appendChild(productDiv);
            });
        } else {
            cartItemsDiv.innerHTML = '<p>Dein Einkaufswagen ist leer.</p>';
        }
    }

    function render_price() {
        let classElm = document.querySelectorAll('.totalPrice');
        if (classElm.length > 0) {
            // elements exist
            classElm.forEach(function (elm) {
                elm.textContent = totalPrice.toFixed(2);
            });
        }
    }

    function render() {
        // reset total price on render
        totalPrice = 0;
        // render products
        render_products();
        // render price
        render_price();
    }

    function get_del_btns() {
        // Select all elements with class "del-cart-btn"
        let deleteButtons = document.querySelectorAll(".del-cart-btn");

        // Loop through all delete buttons and add a click event listener
        deleteButtons.forEach((button) => {
            button.addEventListener("click", function (event) {
                // avoid <i> Element (trash icon) to be clicked 
                event.stopPropagation();
                // Get the id of the clicked button
                let buttonId = event.currentTarget.id;
                del_product(parseInt(buttonId));
                // re-render
                render()
                // get "new"-rendered del-cart-btns again
                get_del_btns();
            });
        });
    }

    // render all "sections" on page-load
    render();

    // get del-cart-btn on page-load
    get_del_btns();



})();