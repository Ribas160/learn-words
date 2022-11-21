import { tokenApi } from "./api";

const url = process.env.MIX_REACT_APP_BASE_URL;

let token = tokenApi.getToken();

const createList = async (data) => {
    return await fetch(`${url}/api/lists`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
};

const getAllLists = async () => {
    return await fetch(`${url}/api/lists`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
};

const getListById = async (id) => {
    return await fetch(`${url}/api/lists/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
};

const updateList = async (id, data) => {
    return await fetch(`${url}/api/lists/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
};

const deleteList = async (id) => {
    return await fetch(`${url}/api/lists/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
};

const lists = {
    createList,
    getAllLists,
    getListById,
    updateList,
    deleteList,
};

export default lists;