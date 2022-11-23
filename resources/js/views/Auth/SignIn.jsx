import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Header from "../../components/Header/Header";
import ErrorAlert from "../../components/ErrorAlert/ErrorAlert";

import { tokenApi, authApi } from "../../api/api";

import "./Auth.css";

const SignIn = () => {
    const navigate = useNavigate();
    const [emailErr, setEmailErr] = useState(null);
    const [passwordErr, setPasswordErr] = useState(null);
    const [error, setError] = useState(null);

    const onAlertClose = () => {
        setError(null);
    }

    const submitForm = (e) => {
        e.preventDefault();

        setError(null);
        setEmailErr(null);
        setPasswordErr(null);


        let validated = true;

        let form = e.target;

        if (!form.email.value.match(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu)) {
            setEmailErr("Email is not valid");
            validated = false;
        }

        if (!form.password.value) {
            setPasswordErr("Password can't be empty");
            validated = false;
        }

        if (!validated) {
            return;
        }

        let data = {
            email: form.email.value,
            password: form.password.value,
        };

        authApi.signIn(data)
            .then(res => res.json())
            .then(res => {
                if (res.token) {
                    tokenApi.setToken(res.token);
                    window.location.href = process.env.MIX_REACT_APP_BASE_URL;

                } else if (res.message !== undefined) {
                    setEmailErr(res.message);
                    setPasswordErr(res.message);

                } else {
                    setError("Unknown error occurred");
                }

            }).catch(error => {
                console.log(error.status);
                setError(error);
            });
    }

    return (
        <>
            <Header title="Authorization" returnBtn={false} />
            <main className="wrapper auth">
                { error && <ErrorAlert message={`${error}`} onClose={onAlertClose} /> }
                <form className="auth__form" method="POST" onSubmit={submitForm}>
                    <div className={`auth__form__field ${emailErr && 'auth__form--error'}`}>
                        <input type="text" name="email" placeholder="Email" />
                        <p className="auth__form__field--error">{ emailErr }</p>
                    </div>
                    <div className={`auth__form__field ${passwordErr && 'auth__form--error'}`}>
                        <input type="password" name="password" placeholder="Password" />
                        <p className="auth__form__field--error">{ passwordErr }</p>
                    </div>
                    <button type="submit">
                        Submit
                    </button>
                    <Link to="/sign-up" className="auth__form__link--small">Not registered?</Link>
                </form>
            </main>
        </>
    );
}

export default SignIn;