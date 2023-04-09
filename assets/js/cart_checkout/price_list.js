function calc_price(method="product") {
    let price = 0;
    // define shipping price
    const shippingPrice = 5;

    const cartData = JSON.parse(localStorage.getItem('shop_cart'));

    if (cartData && cartData.cart && cartData.cart.length > 0) {
        cartData.cart.forEach(product => {
            price += product.price;
        });
        if (method === "total") {
            return price + shippingPrice;
        } else if (method === "product") {
            return price;
        }
    } else {
        return price;
    }
}

export function render_priceList() {
    const productsDiv = document.getElementById('price-items');
    // clear previous content in the div (products) --> start new rendering
    productsDiv.innerHTML = "";

    const cartData = JSON.parse(localStorage.getItem('shop_cart'));

    if (cartData && cartData.cart && cartData.cart.length > 0) {
        cartData.cart.forEach(product => {
            const productLi = document.createElement('li');
            productLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-condensed');
            productLi.innerHTML = `
          <div>
            <h6 class="my-0">${product.name}</h6>
            <small class="text-muted">${product.quantity}x | Größe ${product.size}</small>
          </div>
          <span class="text-muted">$${product.price.toFixed(2)}</span>
        `;
            productsDiv.appendChild(productLi);
        });
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
}

export function render_price_total() {
    const totalPrice = calc_price("total");
    let classElm = document.querySelectorAll('.totalPrice');
    if (classElm.length > 0) {
        // elements exist
        classElm.forEach(function (elm) {
            elm.textContent = totalPrice.toFixed(2);
        });
    }
}

export function render_price_product() {
    const productPrice = calc_price("product");
    let classElm = document.querySelectorAll('.productPrice');
    if (classElm.length > 0) {
        // elements exist
        classElm.forEach(function (elm) {
            elm.textContent = productPrice.toFixed(2);
        });
    }
}

