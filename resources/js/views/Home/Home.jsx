import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
// import List from "../../components/List/List";
import Tiles from "../../components/Tiles/Tiles";
import { listsApi } from "../../api/api";

const Home = () => {
    const navigate = useNavigate();

    const items = [
        {
            path: '/writing',
            title: 'Writing',
        }
    ];

    useEffect(() => {
        listsApi.getAllLists()
                    .then(res => {
                        if (res.status === 403) {
                            navigate("/sign-in");
                        }
                    })
    }, []);

    const onItemClick = (item) => {
        navigate(item.path);
    }

    return (
        <>
            <Header title={"Modes"} returnBtn={false} />
            <main className="wrapper home">
                {/* <h2>Modes</h2> */}
                <Tiles items={items} onItemClick={onItemClick} />
            </main>
        </>
    );
}


export default Home;