import { calc_price } from "../cart_checkout/price_list.js";

function valid_id(id) {
    const currentLocation = window.location.href; // Get the current page's URL
    const pathArr = currentLocation.split('/'); // Split the URL into an array of path segments
    const basePathIndex = pathArr.indexOf('Gravelmania_Shop'); // Find the index of the base path
    let basePath;

    if (basePathIndex !== -1) {
        // Construct the base path by joining the remaining path segments
        basePath = pathArr.slice(basePathIndex).join('/');
    } else {
        // Use the current path as the base path
        basePath = pathArr.slice(-1)[0];
    }

    const jsonPath = `${basePath}/assets/data/shop_products.json`; // Construct the path to the JSON file

    return fetch(jsonPath)
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



// can also be used to delete all products out of the cart
export function create_localstorage() {
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

function get_quantity_of_products() {
    check_for_localstorage();
    const shop_cart = localStorage.getItem('shop_cart');
    var shop_cart_json = JSON.parse(shop_cart);
    if (shop_cart_json.cart.length > 0) {
        const count = shop_cart_json.cart.reduce((total, product) => total + Math.abs(product.quantity), 0);
        return count;
    } else {
        return 0;
    }
}

export function update_cartCount() {
    let allQuantity = get_quantity_of_products();
    // Update cartCount on nav button
    document.querySelector('#cartCount').textContent = allQuantity;
    // if cartCount class exits also add value
    let classElm = document.querySelectorAll('.cartCount');
    if (classElm.length > 0) {
        // elements exist
        classElm.forEach(function (elm) {
            elm.textContent = allQuantity;
        });
    }


}

export function add_product(id, size, quantity) {
    valid_id(id).then(product => {
        check_for_localstorage();

        const shop_cart = localStorage.getItem('shop_cart');
        var shop_cart_json = JSON.parse(shop_cart);
        if (product != null) {
            // check if product already exists and stack them on one product place (same id, size)
            if (shop_cart_json.cart.some(product => product.id === id && product.size === size)) {
                let productPos = shop_cart_json.cart.findIndex(product => product.id === id && product.size === size);
                shop_cart_json["cart"][productPos].quantity += quantity;
            } else {
                // add size and quantity 
                product.size = size;
                product.quantity = Math.abs(quantity);
                shop_cart_json["cart"].push(product);
            }
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

export async function generate_cart_html() {
    check_for_localstorage();
    const shop_cart = localStorage.getItem('shop_cart');
    var shop_cart_json = JSON.parse(shop_cart);

    const cart = shop_cart_json["cart"];

    // Create the table element
    const table = document.createElement('table');
    table.className = 'styled-table';
    table.style.borderCollapse = 'collapse';
    table.style.margin = '25px 0';
    table.style.fontSize = '0.9em';
    table.style.fontFamily = 'sans-serif';
    table.style.minWidth = '400px';
    table.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.15)';

    // Create the table head
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.style.backgroundColor = '#DC5F00';
    headerRow.style.color = '#ffffff';
    headerRow.style.textAlign = 'left';

    const headers = ['ID', 'Name', 'Groesse', 'Preis', 'Anzahl', 'Teilpreis'];
    for (const header of headers) {
        const th = document.createElement('th');
        th.style.padding = '12px 15px';
        th.textContent = header;
        headerRow.appendChild(th);
    }

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement('tbody');

    for (const item of cart) {
        const item_name = await get_prop_of_id("name", item.id);
        const item_price = (await get_prop_of_id("price", item.id));
        const row = [
            item.id,
            item_name,
            item.size,
            item_price.toFixed(2) + ' €',
            Math.abs(item.quantity),
            Math.abs(item.quantity) * item_price + ' €'
        ];
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #dddddd';

        for (const cell of row) {
            const td = document.createElement('td');
            td.style.textAlign = 'center';
            td.style.padding = '12px 15px';
            td.textContent = cell;
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }

    table.appendChild(tbody);

    const total_product_price = await calc_price();

    // Create the table footer
    const tfoot = document.createElement('tfoot');
    const tfootRow = document.createElement('tr');
    const tfootCol1 = document.createElement('th');
    const tfootCol3 = document.createElement('td');
    tfootCol1.colSpan = 2;
    tfootCol1.style.padding = '12px 15px';
    tfootCol1.textContent = 'Preis Gesamt :';
    tfootCol3.style.textAlign = 'center';
    tfootCol3.style.padding = '12px 15px';
    tfootCol3.innerHTML = '<strong>' + total_product_price + ' €</strong>';
    tfootRow.appendChild(tfootCol1);
    tfootRow.appendChild(tfootCol3);
    tfoot.appendChild(tfootRow);
    table.appendChild(tfoot);

    return table.outerHTML;
}