import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import ErrorAlert from "../../components/ErrorAlert/ErrorAlert";

import Tiles from "../../components/Tiles/Tiles";

import { listsApi } from "../../api/api";

const WritingGroups = () => {
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [wordGroups, setWordGroups] = useState([]);

    useEffect(() => {
        updateWordGroups();

    }, []);
    

    const onAlertClose = () => {
        setError(null);
    }

    const onItemClick = (item) => {
        navigate(`${item.id}`);
    }

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

    return (
        <>
            <Header title={"Writing"} />
            <main className="wrapper writing">
                { error && <ErrorAlert message={`${error}`} onClose={onAlertClose} /> }
                { wordGroups && <Tiles items={wordGroups} onItemClick={onItemClick} /> }
            </main>
        </>
    );
}


export default WritingGroups;