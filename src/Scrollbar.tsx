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
    const [maxDisplayElements, setMaxDisplayElements] = useState(-1);
    const [overflowUpCount, setOverflowUpCount] = useState(0);
    const [overflowDownCount, setOverflowDownCount] = useState(0);

    const scrollbarContainerRef = useRef<HTMLDivElement>(null);

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

    function getSegmentWidth(index: number): number {
        const borderIndexUp = maxDisplayElements > 0 ? (maxDisplayElements - 1) : (segmentCount - 1);
        const borderIndexDown = 0;

        const borderUpDiff = Math.abs(index - borderIndexUp);
        const borderDownDiff = Math.abs(index - borderIndexDown);

        const borderDiff = Math.min(borderUpDiff, borderDownDiff);
        const overflowCount = borderDiff === borderUpDiff ? overflowUpCount : overflowDownCount;

        if(overflowCount > 0) {
            if(borderDiff === 0) return overflowCount === 1 ? segmentWidthSmall : segmentWidthSmallest;
            if(borderDiff === 1) return overflowCount === 1 ? segmentWidthDefault : segmentWidthSmall;
        }
        return segmentWidthDefault;
    }

    return(
        <div className="scrollbar">
            {Array.from({length: segmentCount}).map( (_, index) => {
                return (
                    <Scrollsegment 
                        key = {"Scrollsegment-" + index}
                        color = {isIndexInRange(index) ? segmentSelectColor : segmentColorDefault}
                        width = { getSegmentWidth(index) }
                    />
                );
            })}
        </div>
    )
}

export default Scrollbar