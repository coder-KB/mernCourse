import React, { useState, useEffect } from 'react';
import DropIn from "braintree-web-drop-in-react";
import { getMeToken, processPayment } from './helper/paymentBHelper';
import { isAuthenticated } from './../auth/helper/index';
import { cartEmpty } from './helper/cartHelper';
import { createOrder } from './helper/orderHelper';

const PaymentB = ({
    products,
    setReload = f => f,
    reload = undefined
}) => {

    const [info, setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: {}
    })

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) => {
        getMeToken(userId, token)
            .then(info => {
                if (info.error) {
                    setInfo({
                        ...info,
                        error: info.error
                    })
                }
                else {
                    const clientToken = info.clientToken;
                    setInfo({ clientToken });
                }
            })
    }

    const showBrainTreeDropIn = () => {
        return (
            <div>
                {info.clientToken !== null && products && products.length > 0 ? (
                    <div className="row justify-content-center">
                        <DropIn
                            options={{ authorization: info.clientToken }}
                            onInstance={instance => (info.instance = instance)}
                        />
                        <button className="btn col-md-11 btn-success" onClick={onPurchase}>Buy</button>
                    </div>
                ) : (
                        <h3 className="text-white">Please login or add something to cart</h3>
                    )}
            </div>
        )
    }

    useEffect(() => {
        getToken(userId, token);
    }, [])

    const getAmount = () => {
        let amount = 0;
        if (products) {
            products.map(p => {
                amount = amount + p.price
            })
        }
        return amount;
    }

    const onPurchase = () => {
        setInfo({ loading: true });
        let nonce;
        let getNonce = info.instance.requestPaymentMethod()
            .then(data => {
                nonce = data.nonce;
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getAmount()
                };
                processPayment(userId, token, paymentData)
                    .then(response => {
                        setInfo({ ...info, loading: false, success: response.success })
                        // console.log("SUCCESS PAYMENT");
                        const orderData = {
                            products: products,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount
                        }
                        createOrder(userId, token, orderData);

                        cartEmpty(() => setReload(!reload));
                    })
                    .catch(err => {
                        setInfo({ loading: false, success: false })
                        // console.log("FAILED PAYMENT");
                    })
            })
            .catch(err => console.log(err))
    }

    return (
        <div>
            <h3 className="text-white">Your bill is ${getAmount()}</h3>
            {showBrainTreeDropIn()}
        </div>
    )
}

export default PaymentB;