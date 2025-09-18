import { useEffect, useImperativeHandle, useState, type JSX } from 'react';
import './Scrollbar.css';

function Scrollsegment() {

    const [color, setColor] = useState("#888");

    return (
        <div className="scrollSegment" style={{backgroundColor: color}}>

        </div>
    );
}

function Scrollbar( {scrollbarRef}: any ) {

    const [scrollsegments, setScrollsegments] = useState<JSX.Element[]>([]);

    useImperativeHandle(scrollbarRef, () => ({
        addScrollsegment: () => {
            addSegment();
        },

        setScrollsegmentIndex: (index: number) => {
            setSegmentIndex(index);
        }
    }));

    function addSegment() {
        setScrollsegments(prev => [<Scrollsegment key={"Scrollsegment-" + prev.length}/>, ...prev]);
    }

    function setSegmentIndex(index: number) {
        if(index < 0 || index >= scrollsegments.length) return;
    }

    useEffect(() => {
        addSegment();
        addSegment();
        addSegment();
    }, []);

    return(
        <div className="scrollbar">
            {scrollsegments}
        </div>
    )
}

export default Scrollbar