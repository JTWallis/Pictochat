import './ScrollList.css';

function ScrollList( {children}: any ) {
    return (
        <div className="scrollList">
                {children}
        </div>
    );
}

export default ScrollList