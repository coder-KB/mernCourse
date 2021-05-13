import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Base from './../core/Base';
import { isAuthenticated } from './../auth/helper/index';
import { deleteCategory, getCategories } from "./helper/adminapicall"

const ManageCategories = () => {

    const [categories, setCategories] = useState([])

    const { user, token } = isAuthenticated();

    const preload = () => {
        getCategories().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setCategories(data)
            }
        })
    }

    useEffect(() => {
        preload();
    }, [])


    const deleteThisCategory = categoryId => {
        deleteCategory(categoryId, user._id, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    preload();
                }
            })
    }

    return (
        <Base title="Welcome admin" description="Manage Categories here">
            <h2 className="mb-4">All products:</h2>
            <Link className="btn btn-info" to={`/admin/dashboard`}>
                <span className="">Admin Home</span>
            </Link>
            <div className="row">
                <div className="col-12">
                    <h2 className="text-center text-white my-3">Total {categories.length} categories</h2>

                    {categories && categories.map((category, index) => (
                        <div className="row text-center mb-2" key={index}>
                            <div className="col-4">
                                <h3 className="text-white text-left">{category.name}</h3>
                            </div>
                            <div className="col-4">
                                <Link
                                    className="btn btn-success"
                                    to={`/admin/category/update/${category._id}`}
                                >
                                    <span className="">Update</span>
                                </Link>
                            </div>
                            <div className="col-4">
                                <button onClick={() => { deleteThisCategory(category._id) }} className="btn btn-danger">
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

export default ManageCategories;