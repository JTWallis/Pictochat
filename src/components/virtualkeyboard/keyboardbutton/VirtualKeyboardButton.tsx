type VirtualKeyboardButtonProps = {
    value: string;
    src: string;
    className: string;
    onMouseDown: (e: React.MouseEvent<HTMLInputElement>) => void;
    onClick: (e: React.MouseEvent<HTMLInputElement>) => void;
}

/**
 * A VirtualKeyboardButton represents a clickable HtmlImage element
 * on a {@link VirtualKeyboard}-layout, depicting a sprite for a character.
 * The component can also be dragged, to create a {@link FloatingKey}.
 */
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