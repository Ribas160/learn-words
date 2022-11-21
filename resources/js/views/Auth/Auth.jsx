import Header from "../../components/Header/Header";

import "./Auth.css";

const Auth = () => {

    return (
        <>
            <Header title="Authorization" returnBtn={false} />
            <main className="wrapper auth">
                <form className="auth__form" method="POST">
                    <input type="text" name="username" placeholder="Username" />
                    <input type="password" name="password" placeholder="Password" />
                    <button>
                        Submit
                    </button>
                </form>
            </main>
        </>
    );
}

export default Auth;