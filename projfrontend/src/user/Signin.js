import React, { useState } from 'react';
import { Redirect } from "react-router-dom";
import Base from './../core/Base';
import { isAuthenticated, signin, authenticate } from './../auth/helper/index';

const Signin = () => {

    const [values, setValues] = useState({
        email: "ad@gmail.com",
        password: "12345",
        error: "",
        loading: false,
        didRedirect: false
    })

    const { email, password, error, loading, didRedirect } = values;
    const { user } = isAuthenticated();

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value })
    }

    const performRedirect = () => {
        if (didRedirect) {
            if (user && user.role === 1) {
                return <Redirect to='/admin/dashboard' />
            } else {
                return <Redirect to='/user/dashboard' />
            }
        }

        if (isAuthenticated()) {
            return <Redirect to="/" />
        }
    }

    const onSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: false, loading: true });
        signin({ email, password })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false })
                } else {
                    authenticate(data, () => {
                        setValues({
                            ...values,
                            loading: false,
                            didRedirect: true
                        })
                    })

                }
            })
            .catch(console.log("error in signin submit"))
    }

    const loadingMessage = () => {
        return (
            loading && (
                <div className="alert alert-info">
                    <h2>Loading...</h2>
                </div>
            )
        )
    }

    const errorMessage = () => {
        return (
            <div className="row">
                <div className="col-md-4 offset-sm-3 text-left">
                    <div className="alert alert-danger"
                        style={{ display: error ? "" : "none" }}
                    >
                        {error}
                    </div>
                </div>
            </div>
        )
    }

    const signInForm = () => {
        return (
            <div className="row">
                <div className="col-md-4 offset-sm-3 text-left">
                    <form>
                        <div className="form-group py-2">
                            <label className="text-light">Email</label>
                            <input type="email" className="form-control" onChange={handleChange("email")} value={email} />
                        </div>
                        <div className="form-group py-2">
                            <label className="text-light">Password</label>
                            <input type="password" className="form-control" onChange={handleChange("password")} value={password} />
                        </div>

                        <button onClick={onSubmit} className="btn btn-success btn-block form-control">Submit</button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <Base title="SignIn page" description="A page for user to signin!">
            {loadingMessage()}
            {errorMessage()}
            {signInForm()}
            {performRedirect()}
            <p className="text-white text-center">{JSON.stringify(values)}</p>
        </Base>
    )
}

export default Signin;