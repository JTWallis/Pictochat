import { useEffect, useImperativeHandle, useState, type JSX } from 'react';
import './Scrollbar.css';

const segmentColorDefault = "#8AF";
const segmentWidthDefault = 70;
const segmentSelectColor = "#0A0";

const selectIndexRadius = 1;

function Scrollsegment( {color, width}: any ) {

    return (
        <div className="scrollSegment" style={{backgroundColor: color, width: `${width}%`}}>

        </div>
    );
}

function Scrollbar( {scrollbarRef}: any ) {

    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [segmentCount, setSegmentCount] = useState(0);

    useImperativeHandle(scrollbarRef, () => ({
        addScrollsegment: () => {
            addSegment();
        },

        setScrollsegmentIndex: (index: number) => {
            if(index < 0 || index >= segmentCount) return;
            // Reverse index because of column-reverse flex-direction.
            setSelectedIndex(segmentCount - 1 - index);
        }
    }));

    function addSegment() {
        setSegmentCount(prev => prev + 1);
        setSelectedIndex(0);

    function initEstimateMaxDisplaySegments() {
        const children = scrollbarContainerRef.current!.children;
        if(children.length <= 0) return;

        const child = children[0];
        const rectHeight = child.getBoundingClientRect().height;

        const styles = window.getComputedStyle(child);
        const margin = parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

        const height = rectHeight + margin;
        const maxElemsEstimate = scrollbarContainerRef.current!.scrollHeight / height;

        setMaxDisplayElements(Math.floor(maxElemsEstimate));
    }

    function isIndexInRange(index: number) {
        return Math.abs(selectedIndex - index) <= selectIndexRadius;
    }

    return(
        <div className="scrollbar">
            {Array.from({length: segmentCount}).map( (_, index) => {
                return (
                    <Scrollsegment 
                        key = {"Scrollsegment-" + index}
                        color = {isIndexInRange(index) ? segmentSelectColor : segmentColorDefault}
                        width = {segmentWidthDefault}
                    />
                );
            })}
        </div>
    )
}

export default Scrollbar