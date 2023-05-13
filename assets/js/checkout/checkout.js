import { render_priceList, render_price_total, render_price_product } from "../cart_checkout/price_list.js"
import { generate_cart_html, create_localstorage, check_for_validity } from "../cart/cart.js";

(function () {
    "use strict";

    // check for checkout button --> enable / disable
    const checkout_button = document.querySelector('.checkout-btn');
    checkout_button.disabled = false;

    function render() {

        // render products
        render_priceList("checkout");

        // render price
        render_price_total();
        render_price_product();

    }

    // render all "sections" on page-load
    render();

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation');

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', async event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            } else {
                // Prevent the form from submitting
                event.preventDefault();

                // Disable the button until next page reload (see top of code)
                checkout_button.disabled = true;

                document.querySelector('.loading').classList.add('d-block');

                // Retrieve the values of the form inputs
                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const email = document.getElementById('email').value;
                const address = document.getElementById('address').value;
                const address2 = document.getElementById('address2').value;
                const country = document.getElementById('country').value;
                const city = document.getElementById('city').value;
                const zip = document.getElementById('zip').value;

                var templateParams = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    address: address,
                    address2: address2,
                    country: country,
                    city: city,
                    zip: zip,
                    html: await generate_cart_html()
                };

                // Log the values of the form inputs to the console
                 // console.log(templateParams);

                async function handleFormSubmission() {
                    try {
                        await check_for_validity();

                        await emailjs.send('service_087y4mu', 'template_wlzgfne', templateParams);

                        console.log('The order request has been successfully sent.');
                        document.querySelector('.loading').classList.remove('d-block');
                        document.querySelector('.sent-message').classList.add('d-block');

                        // reset cart
                        create_localstorage();
                    } catch (error) {
                        document.querySelector('.loading').classList.remove('d-block');
                        document.querySelector('.error-message').innerHTML = "Etwas ist schiefgelaufen... (Hat jemand einen Schlauch?)";
                        document.querySelector('.error-message').classList.add('d-block');
                        throw error;
                    }
                }

                // Call handleFormSubmission directly, which will trigger the validation and submission process
                handleFormSubmission();

            }

            form.classList.add('was-validated');
        }, false)
    })

})();