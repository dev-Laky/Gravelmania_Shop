import { get_prop_of_id } from "/assets/js/cart/cart.js";

async function calc_price(method = "product") {
    let price = 0;
    // define shipping price
    const shippingPrice = 5;

    const cartData = JSON.parse(localStorage.getItem('shop_cart'));

    if (cartData && cartData.cart && cartData.cart.length > 0) {
        const itemPrices = await Promise.all(cartData.cart.map(product => get_prop_of_id("price", product.id)));
        price = itemPrices.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        if (method === "total") {
            return price + shippingPrice;
        } else if (method === "product") {
            
            return price;
        }
    } else {
        // no products in cart --> price = 0
        return price;
    }
}

export async function render_priceList(method = "cart") {
    const productsDiv = document.getElementById('price-items');
    // clear previous content in the div (products) --> start new rendering
    productsDiv.innerHTML = "";

    const cartData = JSON.parse(localStorage.getItem('shop_cart'));

    if (cartData && cartData.cart && cartData.cart.length > 0) {
        for (const product of cartData.cart) {
            const productLi = document.createElement('li');
            productLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-condensed');
            productLi.innerHTML = `
                <div>
                    <h6 class="my-0">${(await get_prop_of_id("name", product.id))}</h6>
                    <small class="text-muted">${product.quantity}x | Größe ${product.size}</small>
                </div>
                <span class="text-muted">$${(await get_prop_of_id("price", product.id)).toFixed(2)}</span>
            `;
            productsDiv.appendChild(productLi);
        }
    } else {
        productsDiv.innerHTML = `
            <ul class="list-group mb-3">
                <li class="list-group-item d-flex justify-content-between lh-condensed">
                    <div>
                        <h6 class="my-0">Sieht leer aus...</h6>
                        <small class="text-muted">Lass uns shoppen!</small>
                    </div>
                </li>
            </ul>
        `;
    }

    if (method == "checkout") {
        const additionalItemsUl = document.createElement('ul');
        additionalItemsUl.classList.add('list-group', 'mb-3');
        additionalItemsUl.innerHTML = `
            <li class="list-group-item d-flex justify-content-between bg-light">
                <div class="text-danger">
                    <h6 class="my-0">Lieferkosten</h6>
                    <small>Lieferservice</small>
                </div>
                <span class="text-danger">$5</span>
            </li>

            <li class="list-group-item d-flex justify-content-between">
                <span>Total (USD)</span>
                <strong>$${(await calc_price("total")).toFixed(2)}</strong>
            </li>
        `;
        
        const containerDiv = document.createElement('div');
        containerDiv.appendChild(productsDiv.cloneNode(true));
        containerDiv.appendChild(additionalItemsUl);
        productsDiv.parentNode.replaceChild(containerDiv, productsDiv);
    }
}




export async function render_price_total() {
    const totalPrice = await calc_price("total");
    let classElm = document.querySelectorAll('.totalPrice');
    if (classElm.length > 0) {
        // elements exist
        classElm.forEach(function (elm) {
            elm.textContent = totalPrice.toFixed(2);
        });
    }
}

export async function render_price_product() {
    const productPrice = await calc_price("product");
    let classElm = document.querySelectorAll('.productPrice');
    if (classElm.length > 0) {
        // elements exist
        classElm.forEach(function (elm) {
            elm.textContent = productPrice.toFixed(2);
        });
    }
}