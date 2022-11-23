import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import Header from "../../../components/Header/Header";
import ErrorAlert from '../../../components/ErrorAlert/ErrorAlert';

import { itemsApi } from '../../../api/api';

import "./WritingWords.css";

const WritingWords = () => {
    const navigate = useNavigate();
    const { groupId } = useParams();

    const [error, setError] = useState(null);
    const [word, setWord] = useState({lang1: "", lang2: ""});
    const spelling = useRef(null);

    useEffect(() => {
        getAllWords();

    }, []);

    /* Alert */
    const onAlertClose = () => {
        setError(null);
    }
    

    const getAllWords = () => {
        itemsApi.getAllItems(groupId)
            .then(res => {
                if (res.status === 403) {
                    navigate("/sign-in");
                }

                return res;
            })
            .then(res => res.json())
            .then(groupItems => {

                if (groupItems.length === 0) {
                    navigate(`/groups/${groupId}`);
                }

                let i = Math.floor(Math.random() * groupItems.length);
                setWord(groupItems[i]);
            })
            .catch(error => {
                console.log(error);
                setError(error);
            });
    }


    const spellingAction = (e) => {
        let value = e.target.value.replace(/\s/, "");
        let letters = [...spelling.current.querySelectorAll('.spelling--letter')];

        createCursor(letters, value);

        if (/[\u0591-\u07FF]/.test(word.lang2)) {
            letters = letters.reverse();
        }

        [...word.lang2.replace(/\s/, "")].forEach((el, i) => {
            if (value[i]) {
                letters[i].innerHTML = value[i];

            } else {
                letters[i].innerHTML = "";
                letters[i].classList.remove("spelling--errorLetter");
            }

        });
        checkLetters(letters, value);
    }

    const createCursor = (letters, value) => {
        hideCursor();
        
        if (/[\u0591-\u07FF]/.test(word.lang2)) {
            letters = [...letters].reverse();
        }

        if (value.length < word.lang2.replace(/\s/, "").length) {
            letters[value.length].classList.add("spelling--cursor");
        }
    }


    const hideCursor = () => {
        let letters = [...spelling.current.querySelectorAll('.spelling--letter')];

        [...letters].forEach(el => {
            el.classList.remove("spelling--cursor");
        });
    }

    const checkLetters = (letters, value) => {
        let correct = true;

        if (value.length === word.lang2.replace(/\s/, "").length) {
            [...word.lang2.replace(/\s/, "")].forEach((el, i) => {
                if (el.toLowerCase() !== value[i].toLowerCase()) {
                    correct = false;
                    letters[i].classList.add("spelling--errorLetter");
                }
            });

        } else {
            correct = false;
        }

        if (correct) {
            spelling.current.classList.add("spelling--success");
            
            setTimeout(() => {
                getAllWords();
                spelling.current.classList.remove("spelling--success");
                spelling.current.querySelector(".spelling--input").value = "";
                [...spelling.current.querySelectorAll(".spelling--letter")].forEach(el => {
                    el.innerHTML = "";
                });
                createCursor(letters, "");
                
            }, 500);

        } else {
            spelling.current.classList.remove("spelling--success");
        }
    }

    return (
        <>
            <Header title={"Writing"} />
            <main className="wrapper">
                { error && <ErrorAlert message={`${error}`} onClose={onAlertClose} /> }
                <div className="writingWords">
                    <p className="writingWords--word">{ word.lang1 }</p>
                    <div className="writingWords__spelling" ref={spelling}>
                        <input 
                            type="text" 
                            className="spelling--input" 
                            onInput={spellingAction} 
                            onFocus={spellingAction}
                            onBlur={hideCursor}
                            maxLength={word.lang2.length}
                            autoComplete="off"
                        />

                        {[...word.lang2].map((el, i) => {

                            if (el === " ") {
                                return <div className="spelling--space" key={i}></div>
                            }

                            return <div className="spelling--letter" key={i}></div>
                        })}
                    </div>
                </div>
            </main>
        </>
    );
}


export default WritingWords;