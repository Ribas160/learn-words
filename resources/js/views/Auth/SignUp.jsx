import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import ErrorAlert from "../../components/ErrorAlert/ErrorAlert";

import { tokenApi, authApi } from "../../api/api";

import "./Auth.css";

const SignUp = () => {
    const navigate = useNavigate();
    const [nameErr, setNameErr] = useState(null);
    const [emailErr, setEmailErr] = useState(null);
    const [passwordErr, setPasswordErr] = useState(null);
    const [passwordConfirmationErr, setPasswordConfirmationErr] = useState(null);
    const [error, setError] = useState(null);

    const onAlertClose = () => {
        setError(null);
    }

    const submitForm = (e) => {
        e.preventDefault();

        setNameErr(null);
        setEmailErr(null);
        setPasswordErr(null);
        setPasswordConfirmationErr(null);
        setError(null);

        let validated = true;

        let form = e.target;

        if (!form.name.value) {
            setNameErr("Username can't be empty");
            validated = false;
        }

        if (!form.email.value.match(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu)) {
            setEmailErr("Email is not valid");
            validated = false;
        }

        if (!form.password.value) {
            setPasswordErr("Password can't be empty");
            validated = false;
        }

        if (form.password.value !== form.password_confirmation.value) {
            setPasswordConfirmationErr("Passwords are not indentical");
            validated = false;
        }

        if (!validated) {
            return;
        }

        let data = {
            name: form.name.value,
            email: form.email.value,
            password: form.password.value,
            password_confirmation: form.password_confirmation.value,
        };

        authApi.signUp(data)
            .then(res => res.json())
            .then(res => {
                if (res.token) {
                    tokenApi.setToken(res.token);
                    window.location.href = process.env.MIX_REACT_APP_BASE_URL;
                }

            }).catch(error => {
                console.log(error);
                setError(error);
            });
    }

    return (
        <>
            <Header title="Authorization" returnBtn={false} />
            <main className="wrapper auth">
                { error && <ErrorAlert message={`${error}`} onClose={onAlertClose} /> }
                <form className="auth__form" method="POST" onSubmit={submitForm}>
                    <div className={`auth__form__field ${nameErr && 'auth__form--error'}`}>
                        <input type="text" name="name" placeholder="Name" />
                        <p className="auth__form__field--error">{ nameErr }</p>
                    </div>
                    <div className={`auth__form__field ${emailErr && 'auth__form--error'}`}>
                        <input type="email" name="email" placeholder="Email" />
                        <p className="auth__form__field--error">{ emailErr }</p>
                    </div>
                    <div className={`auth__form__field ${passwordErr && 'auth__form--error'}`}>
                        <input type="password" name="password" placeholder="Password" />
                        <p className="auth__form__field--error">{ passwordErr }</p>
                    </div>
                    <div className={`auth__form__field ${passwordConfirmationErr && 'auth__form--error'}`}>
                        <input type="password" name="password_confirmation" placeholder="Confirm your passord" />
                        <p className="auth__form__field--error">{ passwordConfirmationErr }</p>
                    </div>
                    <button type="submit">
                        Submit
                    </button>
                </form>
            </main>
        </>
    );
}

export default SignUp;