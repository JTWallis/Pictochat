import { useEffect, useState, type JSX } from 'react';
import './Scrollbar.css';

function Scrollsegment() {

    const [color, setColor] = useState("#888");

    return (
        <div className="scrollSegment" style={{backgroundColor: color}}>

        </div>
    );
}

function Scrollbar() {

    const [scrollsegments, setScrollsegments] = useState<JSX.Element[]>([]);

    function addScrollsegment() {
        setScrollsegments(prev => [...prev, <Scrollsegment key={"Scrollsegment-" + prev.length}/>]);
    }

    useEffect(() => {
        addScrollsegment();
        addScrollsegment();
        addScrollsegment();
    }, []);

    return(
        <div className="scrollbar">
            {scrollsegments}
        </div>
    )
}

export default Scrollbar