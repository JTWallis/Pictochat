type VirtualKeyboardButtonProps = {
    value: string;
    src: string;
    className: string;
    onMouseDown: (e: React.MouseEvent<HTMLInputElement>) => void;
    onClick: (e: React.MouseEvent<HTMLInputElement>) => void;
}

function VirtualKeyboardButton(props: VirtualKeyboardButtonProps ) {
    return (
        <input
            type="image"
            value={props.value}
            alt={props.value}
            src={props.src}
            className={props.className}
            onMouseDown={props.onMouseDown}
            onClick={props.onClick}
        />
    );
}

export default VirtualKeyboardButton;