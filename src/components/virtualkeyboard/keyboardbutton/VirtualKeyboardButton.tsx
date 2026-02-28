
function VirtualKeyboardButton( {value, src, className, handleButtonMouseDown, handleOnClick }: any ) {
    return (
        <input
            type="image"
            value={value}
            alt={value}
            src={src}
            className={className}
            onMouseDown={handleButtonMouseDown}
            onClick={handleOnClick}
        />
    );
}

export default VirtualKeyboardButton;