const tokenExists = () => {
    return localStorage.getItem("token") !== null;
};

const setToken = (token) => {
    localStorage.setItem("token", token);
};

const getToken = () => {
    return localStorage.getItem("token");
};

const token = {
    tokenExists,
    setToken,
    getToken,
};

export default token;