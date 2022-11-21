import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../../../components/Header/Header";
import Button from "../../../components/Button/Button";
import ErrorAlert from "../../../components/ErrorAlert/ErrorAlert";
import Form from "../../../components/Form/Form";


// import { ReactComponent as Delete } from "../../../assets/delete.svg";
// import { ReactComponent as Edit } from "../../../assets/edit.svg";

import { listsApi, itemsApi } from "../../../api/api";

import "./Group.css";

const Group = () => {
    const navigate = useNavigate();
    const { groupId } = useParams();

    const group = useRef(null);

    const [error, setError] = useState(null);
    const [groupName, setGroupName] = useState("");
    const [groupItems, setGroupItems] = useState([]);
    const [editItemId, setEditItemId] = useState(0);
    const [formOpen, setFormOpen] = useState(false);
    const [isEditForm, setIsEditForm] = useState(false);
    const [formButtonText, setFormButtonText] = useState("Create");
    const [formFields, setFormFields] = useState([
        {
            name: "lang1",
            defaultValue: "",
            placeholder: "Word 1",
            autocomplete: "off",
        },
        {
            name: "lang2",
            defaultValue: "",
            placeholder: "Word 2",
            autocomplete: "off",
        },
    ]);

    useEffect(() => {
        setError(null);

        getGroupName();
        getGroupItems();

    }, []);


    /* Alert */
    const onAlertClose = () => {
        setError(null);
    }


    /* Onload */
    const getGroupName = () => {
        listsApi.getListById(groupId)
            .then(res => {
                if (res.status === 403) {
                    navigate("/sign-in");
                }

                return res;
            })
            .then(res => res.json())
            .then(res => {
                if (res.title !== undefined) {
                    setGroupName(res.title);

                } else {
                    setError(res.message ?? "Impossible to get group name");
                }
            })
            .catch(error => {
                console.log(error);
                setError(error);
            });
    }

    const getGroupItems = () => {
        itemsApi.getAllItems(groupId)
            .then(res => {
                if (res.status === 403) {
                    navigate("/sign-in");
                }

                return res;
            })
            .then(res => res.json())
            .then(groupItems => {
                setGroupItems(groupItems);
            })
            .catch(error => {
                console.log(error);
                setError(error);
            });
    }


    /* Pop up form */
    const resetFormFields = () => {
        let resetFormFields = [...formFields];
        resetFormFields[0].defaultValue = "";
        resetFormFields[1].defaultValue = "";

        setFormFields(resetFormFields);
    }
    
    const onButtonClick = () => {
        resetFormFields();
        setIsEditForm(false);
        setFormButtonText("Create");
        setFormOpen(!formOpen);
    }

    const onButtonFileClick = () => {
        group.current.querySelector(".group--fileInput").click();
    }

    const onFormClose = () => {
        resetFormFields();
        setFormOpen(false);
    }

    const onFormSubmit = (data) => {

        if (isEditForm) {
            itemsApi.updateItem(editItemId, data)
            .then(res => {
                if (res.status === 403) {
                    navigate("/sign-in");
                }

                if (res.status === 204) {
                    resetFormFields();
                    setFormOpen(false);
                    getGroupItems();

                    return;
                }

                return res.json();
            })
            .then(res => {
                if (res !== undefined && res.message !== undefined) {
                    setError(res.message);
                }
            })
            .catch(error => {
                console.log(error);
                setError(error);
            });

        } else {
            itemsApi.createItem(groupId, data)
                .then(res => {
                    if (res.status === 403) {
                        navigate("/sign-in");
                    }

                    if (res.status === 201) {
                        setFormOpen(false);
                    }
                    
                    return res.json();
                })
                .then(res => {
                    if (res.message !== undefined) {
                        setError(res.message);
                    }

                    resetFormFields();
                    getGroupItems();
                })
                .catch(error => {
                    console.log(error);
                    setError(error);
                });
        }
    }


    const onFileInputChange = (e) => {
        itemsApi.createItemsFile(groupId, e.target.files[0])
            .then(res => {
                if (res.status === 403) {
                    navigate("/sign-in");
                }

                if (res.status === 201) {
                    setFormOpen(false);
                }

                console.log(e.target.files[0]);
                e.target.value = "";

                console.log(res);
                
                return res.json();
            })
            .then(res => {
                if (res.message !== undefined) {
                    setError(res.message);
                }

                console.log(res);

                resetFormFields();
                getGroupItems();
            })
            .catch(error => {
                console.log(error);
                setError(error);
            });
    }


    /* Items actions */
    const editItem = (item) => {
        let editFormFields = [...formFields];
        editFormFields[0].defaultValue = item.lang1;
        editFormFields[1].defaultValue = item.lang2;

        setEditItemId(item.id);
        setFormFields(editFormFields);
        setIsEditForm(true);
        setFormButtonText("Update");
        setFormOpen(true);
    }

    const deleteItem = (item) => {
        itemsApi.deleteItem(item.id)
            .then(res => {
                if (res.status === 403) {
                    navigate("/sign-in");
                }

                getGroupItems();
            })
            .catch(error => setError(error));
    }

    return (
        <>
            <Header title={groupName} />
            <main className="wrapper group" ref={group}>
                { error && <ErrorAlert message={`${error}`} onClose={onAlertClose} /> }
                <ul>
                    {groupItems && groupItems.map((el, i) => (
                        <li key={i}>
                            <div className="group__langs">
                                <span className="group__langs--lang1">{el.lang1}</span>
                                <span className="group__langs--lang2">{el.lang2}</span>
                            </div>
                            <div className="group__action">
                                <img
                                    src={`${process.env.MIX_REACT_APP_BASE_URL}/images/delete.svg`}
                                    className="group__action--delete"
                                    onClick={() => deleteItem(el)}
                                    alt="Delete"
                                />
                                <img
                                    src={`${process.env.MIX_REACT_APP_BASE_URL}/images/edit.svg`}
                                    className="group__action--edit"
                                    onClick={() => editItem(el)}
                                    alt="Edit"
                                />
                            </div>
                        </li>
                    ))}
                </ul>
                { formOpen && 
                    <Form fields={formFields} buttonText={formButtonText} onClose={onFormClose} onSubmit={onFormSubmit} /> 
                }
                <Button text="Add new" onClick={onButtonClick} />
                <Button text="Upload file" onClick={onButtonFileClick} />

                <input 
                    className="group--fileInput" 
                    type="file" 
                    name="file" 
                    accept=".csv" 
                    onChange={onFileInputChange} 
                />
            </main>
        </>
    );
}


export default Group;