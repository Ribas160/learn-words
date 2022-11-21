import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import ErrorAlert from "../../components/ErrorAlert/ErrorAlert";

import Tiles from "../../components/Tiles/Tiles";
import Form from "../../components/Form/Form";
import Button from "../../components/Button/Button";

import { listsApi } from "../../api/api";

const WritingGroups = () => {
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [wordGroups, setWordGroups] = useState([]);

    useEffect(() => {
        setError(null);

        updateWordGroups();

    }, []);


    /* Listeners */
    const onItemClick = (item) => {
        navigate(`${item.id}`);
    }


    /* Onload */
    const updateWordGroups = () => {
        listsApi.getAllLists()
            .then(res => {
                if (res.status === 403) {
                    navigate("/sign-in");
                }

                return res;
            })
            .then(res => res.json())
            .then(groups => {
                setWordGroups(groups);
            })
            .catch(error => {
                console.log(error);
                setError(error);
            })
    }


    /* Alert */
    const onAlertClose = () => {
        setError(null);
    }


    /* Pop up form */
    const formFields = [
        {
            name: "groupName",
            placeholder: "Enter new group name",
            autocomplete: "off",
        },
    ];

    const onButtonClick = () => {
        setFormOpen(!formOpen);
    }

    const onFormClose = () => {
        setFormOpen(false);
    }

    const onFormSubmit = (data) => {
        listsApi.createList({ title: data.groupName })
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

                updateWordGroups();
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <>
            <Header title={"Groups"} />
            <main className="wrapper writing">
                { error && <ErrorAlert message={`${error}`} onClose={onAlertClose} /> }
                { wordGroups && <Tiles items={wordGroups} onItemClick={onItemClick} /> }
                { formOpen && 
                    <Form fields={formFields} buttonText="Create" onClose={onFormClose} onSubmit={onFormSubmit} />
                }
                <Button text="Add new" onClick={onButtonClick} />
            </main>
        </>
    );
}


export default WritingGroups;