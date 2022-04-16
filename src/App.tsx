import {useEffect, useState} from 'react';
import Box from './Box';
import {Demineur, Action, Cell} from "./Demineur";
import PopUp from "./PopUp";

const size = {line: 12, col: 18};

const demineur = new Demineur(size);
const numberBombInit = Math.round(size.line * size.col / 6);

function App() {

    const [arrayCell, setArrayCell] = useState<Cell[][]>([...demineur.arrayCell]);
    const [game, setGame] = useState(false);
    const [isPopUp, setIsPopUp] = useState(false);
    const [numberBomb, setNumberBomb] = useState(numberBombInit);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        setInterval(() => {
            setTimer(timer => timer + 1);
        }, 1000);
    }, []);

    const onClickBox = (numButton: number, x: number, y: number) => {
        if (!game) {
            demineur.generateTab({x, y}, numberBombInit);
            setGame(true);
            setTimer(0);
        }
        if (numButton === 0) {
            if (!demineur.onClick(Action.SHOW, {x, y}))
                setIsPopUp(true);
            else setIsPopUp(demineur.getVictoire());
        }
        else demineur.onClick(Action.FLAG, {x, y});

        setNumberBomb(numberBombInit - demineur.numberFlag());
        setArrayCell([...demineur.arrayCell]);
    };

    const reset = () => {
        demineur.reset();
        setTimer(0);
        setIsPopUp(false);
        setGame(false);
        setNumberBomb(numberBombInit - demineur.numberFlag());
        setArrayCell([...demineur.arrayCell]);
    };

    return (
        <>
            {isPopUp && <PopUp victoire={demineur.getVictoire()} reset={reset} score={timer}/>}
            <div className="flex justify-center flex-col items-center w-screen h-screen bg-[#000]">
                <table>
                    <thead>
                    <tr>
                        <th colSpan={size.col} className={"bg-nav"}>
                            <div className={"text-white py-2 px-8 flex"}>
                                <div className={"flex items-center gap-x-4"}>
                                    <h1 className={"text-3xl"}>Demineur</h1>
                                </div>
                                <div className={"ml-auto flex gap-4 items-center"}>
                                    <div className={"ml-auto flex items-center"}>
                                        <i className="fa-solid fa-bomb fa-lg"></i>
                                        <span className={"ml-2"}>{numberBomb.toLocaleString("en-US", {
                                            minimumIntegerDigits: 2,
                                            useGrouping: false,
                                        })}</span>
                                    </div>
                                    <div className={"ml-auto flex items-center"}>
                                        <i className="fa-solid fa-clock"></i>
                                        {
                                            !game || isPopUp ? (
                                                <span className={"ml-2"}>000</span>
                                            ) : (
                                                <span className={"ml-2"}>{timer.toLocaleString("en-US", {
                                                    minimumIntegerDigits: 3,
                                                    useGrouping: false,
                                                })}</span>
                                            )
                                        }


                                    </div>
                                    <button
                                        className={"flex items-center ml-4 bg-white text-black px-4 py-1 rounded hover:bg-opacity-90 transition"}
                                        onClick={() => reset()}>
                                        Reset
                                        <i className="fa-solid fa-arrow-rotate-right fa-sm ml-1"></i>
                                    </button>
                                </div>
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {arrayCell.map((ligneCell, x) => (
                        <tr key={x}>
                            {ligneCell.map((cell, y) => (
                                <Box etat={cell.etat} n={cell.n} action={cell.action} key={y} onClickBox={onClickBox}
                                     x={x}
                                     y={y}/>
                            ))}
                        </tr>)
                    )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default App;
