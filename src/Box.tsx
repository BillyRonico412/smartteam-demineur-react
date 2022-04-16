import {Action, Etat} from "./Demineur";

function Box(props: { x: number, y: number, etat: Etat, n: number, action: Action, onClickBox: (x: number, y: number, number: number) => void }) {

    let styleBox = "w-8 h-8";
    if (props.action === Action.SHOW)
        styleBox += ((props.x % 2 === props.y % 2) ? " bg-box-3" : " bg-box-4");
    else styleBox += ((props.x % 2 === props.y % 2) ? " bg-box-1" : " bg-box-2");
    switch (props.n) {
        case 1:
            styleBox += " text-blue-700";
            break;
        case 2:
            styleBox += " text-green-700";
            break;
        case 3:
            styleBox += " text-red-700"
            break;
        case 4:
            styleBox += " text-violet-700"
            break;
        case 5:
            styleBox += " text-cyan-700"
            break;
        case 6:
            styleBox += " text-yellow-700"
            break;
    }

    return (
        <td className={styleBox}
            onClick={(e) => props.onClickBox(e.nativeEvent.button, props.x, props.y)}
            onContextMenu={(e) => {
                e.preventDefault();
                props.onClickBox(e.nativeEvent.button, props.x, props.y);
            }}>
            <div className={"flex justify-center items-center text-xl w-full h-full"}>
                {props.action === Action.SHOW && props.n !== 0 && props.n}
                {props.action === Action.FLAG && <i className="fa-solid fa-bomb text-black fa-sm"></i>}
            </div>
        </td>
    );
}

export default Box;