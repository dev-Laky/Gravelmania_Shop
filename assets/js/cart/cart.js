function valid_id(id) {
    return fetch('/assets/data/shop_products.json')
      .then(response => response.json())
      .then(shop_products => {
        const product = shop_products.products.find(product => product.id === id);
        if (product) {
          return product;
        } else {
          throw new Error(`Id: ${id} doesn't exist.`);
        }
      });
  }

function create_localstorage() {
    const shop_cart = { "cart": [] };
    const jsonData = JSON.stringify(shop_cart);
    localStorage.setItem('shop_cart', jsonData);
}

export function check_for_localstorage() {
    if (localStorage.getItem('shop_cart') !== null) {
        try {
            const data = JSON.parse(localStorage.getItem('myData'));
            // pass --> localstorage already exists in valid json format
        } catch (e) {
            create_localstorage();
        }
    } else {
        create_localstorage();
    }
}

export function get_cart_len() {
    check_for_localstorage();
    const shop_cart = localStorage.getItem('shop_cart');
    var shop_cart_json = JSON.parse(shop_cart);
    return shop_cart_json["cart"].length;
}

export function update_cartCount() {
    let count = get_cart_len();
    // Update cartCount on nav button
    document.querySelector('#cartCount').textContent = count;
    // if cartCount class exits also add value
    let classElm = document.querySelectorAll('.cartCount');
    if (classElm.length > 0) {
        // elements exist
        classElm.forEach(function (elm) {
            elm.textContent = count;
        });
    }


}

export function add_product(id, size, quantity) {
    valid_id(id).then(product => {
        check_for_localstorage();

        const shop_cart = localStorage.getItem('shop_cart');
        var shop_cart_json = JSON.parse(shop_cart);
        if (product != null) {
            // add size and quantity 
            product.size = size;
            product.quantity = quantity;
            shop_cart_json["cart"].push(product);
        }

        const jsonData = JSON.stringify(shop_cart_json);
        localStorage.setItem('shop_cart', jsonData);

        update_cartCount();
    });
}

export function del_product(id) {
    const shop_cart = localStorage.getItem('shop_cart');
    var shop_cart_obj = JSON.parse(shop_cart);

    for (let i in shop_cart_obj.cart) {
        if (shop_cart_obj.cart[i].id === id) {
            shop_cart_obj.cart.splice(i, 1);

            const jsonData = JSON.stringify(shop_cart_obj);
            localStorage.setItem('shop_cart', jsonData);

            update_cartCount();
            return;
        }
    }
    throw new Error(`Product with id: ${id} not found in cart.`);
}

// gets a property of a product via id --> secured query (no manipulation by localstorage)
export async function get_prop_of_id(propertyName, id) {
    return (await valid_id(id))[propertyName];
}