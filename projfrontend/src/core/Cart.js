import React, { useEffect, useState } from 'react'
import "../styles.css"
import Base from './Base';
import Card from './Card';
import { loadCart } from './helper/cartHelper';
import StripeCheckout from './StripeCheckout';
import PaymentB from './PaymentB';

const Cart = () => {

    const [products, setProducts] = useState([]);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        setProducts(loadCart())
    }, [reload])

    const loadAllProducts = (products) => {
        return (
            <div>
                <h2>This is a load products</h2>
                {products && products.map((product, index) => (
                    <Card
                        key={index}
                        product={product}
                        removeFromCart={true}
                        addToCart={false}
                        setReload={setReload}
                        reload={reload}
                    />
                ))}
            </div>
        )
    }

    const loadCheckout = () => {
        return (
            <div>
                <h2>This is for Checkout</h2>
            </div>
        )
    }

    return (
        <Base title="Cart Page" description="Ready to Checkout" className="text-center text-white">
            <div className="row">
                <div className="col-6">
                    {products && products.length > 0 ? loadAllProducts(products) : (
                        <h3 className="text-white">NO products in Cart</h3>
                    )}
                </div>
                <div className="col-6">
                    <PaymentB
                        products={products}
                        setReload={setReload}
                        reload={reload}
                    />
                </div>
            </div>
        </Base>
    )
}

export default Cart;