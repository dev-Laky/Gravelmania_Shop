function valid_id(id) {
    return fetch('/assets/data/shop_products.json')
        .then(response => response.json())
        .then(shop_products => {
            for (let i in shop_products.products) {
                if (shop_products.products[i].id === id) {
                    return shop_products.products[i];
                }
            }
            throw new Error(`Id: ${id} doesn't exist.`);
        })
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

export function add_product(id) {
    valid_id(id).then(product => {
        check_for_localstorage();

        const shop_cart = localStorage.getItem('shop_cart');
        var shop_cart_json = JSON.parse(shop_cart);
        if (product != null) {
            shop_cart_json["cart"].push(product);
        }

        const jsonData = JSON.stringify(shop_cart_json);
        localStorage.setItem('shop_cart', jsonData);

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
            return;
        }
    }
    throw new Error(`Product with id: ${id} not found in cart.`);
}