import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Base from './../core/Base';
import { isAuthenticated } from './../auth/helper/index';
import { getProducts, deleteProduct } from "./helper/adminapicall"

const ManageProducts = () => {

    const [products, setProducts] = useState([]);

    const { user, token } = isAuthenticated();

    const preload = () => {
        getProducts().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setProducts(data)
            }
        })
    }

    useEffect(() => {
        preload();
    }, [])

    const deleteThisProduct = (productId) => {
        deleteProduct(productId, user._id, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    preload();
                }
            })
    }

    return (
        <Base title="Welcome admin" description="Manage products here">
            <h2 className="mb-4">All products:</h2>
            <Link className="btn btn-info" to={`/admin/dashboard`}>
                <span className="">Admin Home</span>
            </Link>
            <div className="row">
                <div className="col-12">
                    <h2 className="text-center text-white my-3">Total {products.length} products</h2>

                    {products && products.map((prod, index) => (
                        <div className="row text-center mb-2" key={index}>
                            <div className="col-4">
                                <h3 className="text-white text-left">{prod.name}</h3>
                            </div>
                            <div className="col-4">
                                <Link
                                    className="btn btn-success"
                                    to={`/admin/product/update/${prod._id}`}
                                >
                                    <span className="">Update</span>
                                </Link>
                            </div>
                            <div className="col-4">
                                <button onClick={() => { deleteThisProduct(prod._id) }} className="btn btn-danger">
                                    Delete
                            </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Base>
    )
}

export default ManageProducts;