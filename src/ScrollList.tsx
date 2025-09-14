import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import './ScrollList.css';

function ScrollList( {scrollListRef, scrollListElements}: any ) {

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [indexTop, setIndexTop] = useState(0);
    const [indexBot, setIndexBot] = useState(0);

    useImperativeHandle(scrollListRef, () => ({
        scrollDown: () => {
            const scrollDown = true;
            scrollToNeighbor(scrollDown);
        },

        scrollUp: () => {
            const scrollDown = false;
            scrollToNeighbor(scrollDown);
        }
    }));

    useEffect(() => {
        initScrollIndex();
        
        addEventListener("resize", initScrollIndex);
        return () => {
            removeEventListener("resize", initScrollIndex);
        }
    }, []);

    /**
     * Helper function, to check if a child-rect-boundary touches a ScrollList-boundary
     *  and factors in a few pixels of boundary-area.
     * This is because, when the window is very small, and thus the ScrollList area tight,
     *  the rect-boundaries are slightly offset from the ScrollList-boundaries
     *  (e.g. the top-boundary may be -1 instead of 0, or the bot-boundary may be 12.5 instead of 13).
     * @param pos Boundary position of the child-rect.
     * @param bound Boundary position of the ScrollList.
     * @returns True, if the child-rect boundary is within the threshold of the ScrollList boundary, otherwise false.
     */
    function isInBoundThreshold(pos: number, bound: number): boolean {
        const boundThreshold = 2;
        return pos >= (bound - boundThreshold) && pos <= (bound + boundThreshold);
    }

    /**
     * Init the indexTop and indexBot states based on the current scroll position
     *  on each render-update or window-resize.
     */
    function initScrollIndex() {
        const scrollChildren = scrollContainerRef.current!.children;
        const boundTop = 0;
        const boundBot = scrollContainerRef.current!.clientHeight;
        let setCount = 0;
        const maxIndexCount = 2;

        for(let i = 0; i < scrollChildren.length; i++) {
            const rect = scrollChildren[i].getBoundingClientRect();

            if(isInBoundThreshold(rect.top, boundTop)) {
                setIndexTop(i);
                setCount++;
            }

            if(isInBoundThreshold(rect.bottom, boundBot)) {
                setIndexBot(i);
                setCount++;
            }

            if(setCount >= maxIndexCount) break;
        }

        // Not enough children to touch bottom boundary.
        if(setCount < maxIndexCount) {
            setIndexBot(scrollChildren.length - 1);
        }
    }

    /**
     * Either increment indexTop on a scroll-down or decrement indexBot on a scroll-up,
     *  if the respective element is well outside that boundary side.
     * Sometimes messages are short enough that on a scroll, the checked element has not overflown,
     *  in that case, do nothing.
     * @param updateTopBound If true, check the element of indexTop and update its index. Otherwise check for indexBot.
     */
    function updateIndexBound(updateTopBound: boolean) {
        const scrollChildren = scrollContainerRef.current!.children;
        const checkIndex = updateTopBound ? indexTop : indexBot;
        const checkRect = scrollChildren[checkIndex].getBoundingClientRect();

        const bound = updateTopBound ? 0 : scrollContainerRef.current!.clientHeight;

        if(updateTopBound && !isInBoundThreshold(checkRect.top, bound)) {
            setIndexTop(prev => prev + 1);
        } else if(!updateTopBound && !isInBoundThreshold(checkRect.bottom, bound)) {
            setIndexBot(prev => prev - 1);
        }
    }

    /**
     * Scrolls upwards/downwards and snaps the scrollbar onto the previous/next child element of the ScrollList.
     * @param scrollDown If true, scroll downwards and snap onto the next element. Otherwise, scroll upwards.
     */
    function scrollToNeighbor(scrollDown: boolean) {
        if(!scrollContainerRef) return;
        const scrollChildren = scrollContainerRef.current!.children;

        let indexNext;
        let setTopBound;
        if(scrollDown) {
            indexNext = indexBot + 1;
            if(indexNext >= scrollChildren.length) return;
            setIndexBot(indexNext);
            setTopBound = true;
        } else {
            indexNext = indexTop - 1;
            if(indexNext < 0) return;
            setIndexTop(indexNext);
            setTopBound = false;
        }

        const target = scrollChildren[indexNext];
        target.scrollIntoView({ block: scrollDown ? "end" : "start" });
        updateIndexBound(setTopBound);
    }

    return (
        <div ref={scrollContainerRef} className="scrollList">
            {scrollListElements}
        </div>
    );
}

export default ScrollList