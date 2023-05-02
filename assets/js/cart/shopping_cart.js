import { del_product, get_prop_of_id, get_cart_len } from "../cart/cart.js";
import { render_priceList, render_price_total, render_price_product } from "../cart_checkout/price_list.js"

(function () {
    "use strict";

    // availability of "formular" (form) button 
    function check_for_form_btn() {
        const button = document.querySelector('.formular-btn');
        let cartLen = get_cart_len();
        if (cartLen > 0) {
            button.classList.remove("disabled");
        } else {
            button.classList.add("disabled");
        }
    }

    async function render_products() {
        const cartItemsDiv = document.getElementById('cart-items');
        // clear previous content in the div (products) --> start new rendering
        cartItemsDiv.innerHTML = "";
        const cartData = JSON.parse(localStorage.getItem('shop_cart'));

        if (cartData && cartData.cart && cartData.cart.length > 0) {
            await Promise.all(cartData.cart.map(async item => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('row', 'd-flex', 'justify-content-between', 'align-items-center');
                productDiv.innerHTML = `
            <div class="col-12 col-sm-2 col-md-2 col-lg-2 col-xl-2">
              <img src="https://picsum.photos/640/800" class="img-fluid rounded-3" alt="${item.name}">
            </div>
            <div class="col-4 col-sm-3 col-md-3 col-lg-3 col-xl-3 mobile-shopping-cart-text">
              <h6 class="text-muted">Größe ${item.size}</h6>
              <h6 class="text-black mb-0">${await get_prop_of_id("name", item.id)}</h6>
            </div>
            <div class="col-4 col-sm-3 col-md-3 col-lg-2 col-xl-2 offset-lg-1 mobile-shopping-cart-text">
              <h6 class="mb-0">${Math.abs(item.quantity)} Mal</h6>
            </div>
            <div class="col-4 col-sm-3 col-md-3 col-lg-2 col-xl-2 offset-lg-1 mobile-shopping-cart-text">
              <h6 class="mb-0">${(await get_prop_of_id("price", item.id) * Math.abs(item.quantity)).toFixed(2)} €</h6>
            </div>
            <div class="col-12 col-sm-1 col-md-1 col-lg-1 col-xl-1 text-end">
              <button id="${item.id}-${item.size}" class="btn del-cart-btn"><i class="bi bi-trash text-danger"></i></button>
            </div>
            <hr class="my-4">
          `;
                cartItemsDiv.appendChild(productDiv);
            }));
        } else {
            cartItemsDiv.innerHTML = '<p>Dein Einkaufswagen ist leer.</p>';
        }
    }

    function get_del_btns() {
        // Select all elements with class "del-cart-btn"
        let deleteButtons = document.querySelectorAll(".del-cart-btn");

        // Loop through all delete buttons and add a click event listener
        deleteButtons.forEach((button) => {
            button.addEventListener("click", function (event) {
                // avoid <i> Element (trash icon) to be clicked 
                event.stopPropagation();

                const [itemId, itemSize] = event.currentTarget.id.split('-');
                del_product(parseInt(itemId), itemSize);

                // re-render
                render()
                // get "new"-rendered del-cart-btns again
                get_del_btns();
            });
        });
    }


    async function render() {
        // render products
        await render_products();

        // render products
        render_priceList();

        // render price
        render_price_total();
        render_price_product();

        // check for form button
        check_for_form_btn();

        // get del-cart-btn on page-load
        get_del_btns();
    }

    // render all "sections" on page-load
    render();

})();