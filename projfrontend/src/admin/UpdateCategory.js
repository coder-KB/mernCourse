import React, { useState, useEffect } from 'react'
import Base from './../core/Base';
import { isAuthenticated } from './../auth/helper/index';
import { Link } from 'react-router-dom';
import { updateCategory, getCategory } from './helper/adminapicall';

const UpdateCategory = ({ match }) => {

    const [name, setName] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const { user, token } = isAuthenticated();

    const goBack = () => {
        return (
            <div className="mt-5">
                <Link className="btn btn-sm btn-danger mb-3" to="/admin/dashboard">Admin Home</Link>
            </div>
        )
    }

    const preload = (categoryId) => {
        getCategory(categoryId).then(data => {
            if (data.error) {
                setError(data.error)
            } else {
                setName(data.name);
            }
        })
    }

    useEffect(() => {
        preload(match.params.categoryId)
    }, [])

    const handleChange = (event) => {
        setName(event.target.value);
        setError("");
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setError("");
        setSuccess(false);

        // backend request
        updateCategory(match.params.categoryId, user._id, token, { name })
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setSuccess(true);
                    setName("");
                }
            })
    }

    const successMessage = () => {
        if (success) {
            return <h4 className="text-success">Category Update successfully</h4>
        }
    }

    const warningMessage = () => {
        if (error) {
            return <h4 className="text-warning">{error}</h4>
        }
    }

    const categoryForm = () => {
        return (
            <form>
                <div className="form-group">
                    <p className="lead">Enter the Category</p>
                    <input type="text" name="" id="" className="form-control my-3"
                        autoFocus required placeholder="For Ex. Winter"
                        onChange={handleChange} value={name}
                    />
                    <button onClick={onSubmit} className="btn btn-outline-info">Update Category</button>
                    <br />
                </div>
            </form>
        );
    }

    return (
        <Base
            title="Update a category here!"
            description="update the category for tshirts"
            className="container bg-info p-4"
        >
            <div className="row bg-white rounded">
                <div className="col-md-2">{goBack()}</div>
                <div className="col-md-8">
                    {successMessage()}
                    {warningMessage()}
                    {categoryForm()}
                </div>
            </div>
        </Base>
    )
}

export default UpdateCategory;