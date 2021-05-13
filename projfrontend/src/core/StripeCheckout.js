import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { isAuthenticated } from './../auth/helper/index';
import StripeCheckoutButton from "react-stripe-checkout"
import { API } from './../backend';
import { createOrder } from './helper/orderHelper';
import { cartEmpty } from './helper/cartHelper';

const StripeCheckout = ({
    products,
    setReload = f => f,
    reload = undefined
}) => {
    const [data, setData] = useState({
        loading: false,
        success: false,
        error: "",
        address: ""
    })

    const token = isAuthenticated() && isAuthenticated().token;
    const userId = isAuthenticated() && isAuthenticated().user._id;

    const getFinalPrice = () => {
        if (products) {
            return products.reduce((currentValue, nextValue) => {
                return currentValue + nextValue.count * nextValue.price;
            }, 0);
        }
    }

    const makePayment = (token) => {
        const body = {
            token,
            products
        }

        const headers = {
            "Content-Type": "application/json"
        }

        return fetch(`${API}/stripepayment`, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        })
            .then(response => {
                console.log(response)
                // call further methods here
                const { status } = response;
                console.log("STATUS, ", status);
                cartEmpty(() => setReload(!reload));
            })
            .catch(error => console.log(error))
    }

    const showStripeButton = () => {
        return isAuthenticated() ? (
            <StripeCheckoutButton
                stripeKey="pk_test_51I8A31DfmGF4h3QPScQuHoCFBqhFUVRX5rXGq7GDDCNL3mjIpZJ8B0ZZu5KHMTqBdrN2GOrHgOqzFhIxho65Sh4P00wYW8Tdlj"
                token={makePayment}
                amount={getFinalPrice() * 100}
                name="Buy Tshirts"
                shippingAddress
                billingAddress
            >
                <button className="btn btn-success">Pay With Stripe</button>
            </StripeCheckoutButton>
        ) : (
                <Link to="/signin">
                    <button className="btn btn-warning">Sign In</button>
                </Link>
            );
    }


    return (
        <div>
            <h3 className="text-white">Stripe Checkout {getFinalPrice()}</h3>
            {showStripeButton()}
        </div>
    )
}

export default StripeCheckout;