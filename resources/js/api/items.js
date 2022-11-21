import { tokenApi } from "./api";

const url = process.env.MIX_REACT_APP_BASE_URL;

let token = tokenApi.getToken();

const createItem = async (listId, data) => {
    return await fetch(`${url}/api/lists/${listId}/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
};

const createItemsFile = async (listId, file) => {
    let formData = new FormData();
    formData.append('file', file);

    return await fetch(`${url}/api/lists/${listId}/items/file`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });
};

const getAllItems = async (listId) => {
    return await fetch(`${url}/api/lists/${listId}/items`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
};

const getItemById = async (id) => {
    return await fetch(`${url}/api/items/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
};

const updateItem = async (id, data) => {
    return await fetch(`${url}/api/items/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
};

const deleteItem = async (id) => {
    return await fetch(`${url}/api/items/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
};

const items = {
    createItem,
    createItemsFile,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem,
};

export default items;