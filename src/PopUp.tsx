import {useEffect, useState} from "react";

function PopUp(props: { victoire: boolean, score: number, reset: () => void }) {

    const [score, setScore] = useState(0);
    const [meilleurScore, setMeilleurScore] = useState(0);

    useEffect(() => {
        setScore(props.score);
        if (props.victoire) {
            if (window.localStorage.getItem("meilleur-score") === null)
                window.localStorage.setItem("meilleur-score", String(props.score));
            if (props.score < Number(meilleurScore))
                window.localStorage.setItem("meilleur-score", String(props.score));
        }
        setMeilleurScore(Number(window.localStorage.getItem("meilleur-score")));
    }, []);


    return (
        <div className={"w-screen h-screen absolute bg-[#0008] flex justify-center items-center"}>
            <div className={"bg-white w-96 flex flex-col items-center py-8 rounded-xl"}>
                {
                    props.victoire ? (
                        <h2 className={"text-4xl text-nav"}>Victoire</h2>
                    ) : (
                        <h2 className={"text-4xl text-nav"}>Defaite</h2>
                    )
                }
                {props.victoire && <p className={"mt-8 text-xl"}>Score: {score}</p>}
                <p className={"text-xl"}>Meilleure score: {meilleurScore === 0 ? "Null" : meilleurScore}</p>
                <button className={"bg-nav rounded text-white px-6 py-2 mt-8 text-xl hover:bg-opacity-90 transition"}
                        onClick={() => props.reset()}>
                    Reesayer
                </button>
            </div>
        </div>
    );
}

export default PopUp;