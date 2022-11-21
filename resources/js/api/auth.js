import { tokenApi } from "./api";

const url = process.env.MIX_REACT_APP_BASE_URL;

let token = tokenApi.getToken();

const signUp = async (data) => {
    return await fetch(`${url}/api/sign-up`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
};

const signIn = async (data) => {
    return await fetch(`${url}/api/sign-in`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

const ping = async () => {
    return await fetch(`${url}/api/ping`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
}

const auth = {
    signUp,
    signIn,
    ping,
}

export default auth;