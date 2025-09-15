import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import './ScrollList.css';

function ScrollList( {scrollListRef, scrollListElements}: any ) {

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);

    useImperativeHandle(scrollListRef, () => ({
        scrollDown: () => {
            const scrollDown = true;
            scrollToNeighbor(scrollDown);
        },

        scrollUp: () => {
            const scrollDown = false;
            scrollToNeighbor(scrollDown);
        },

        getBottomMessageIndex: () => {
            return index - 1;
        }
    }));

    useEffect(() => {
        initScrollIndex();
        
        addEventListener("resize", initScrollIndex);
        return () => {
            removeEventListener("resize", initScrollIndex);
        }
    }, []);

    useEffect(() => {
        scrollToLast();
    }, [scrollListElements]);

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
        const boundBot = scrollContainerRef.current!.clientHeight;

        for(let i = 0; i < scrollChildren.length; i++) {
            const rect = scrollChildren[i].getBoundingClientRect();

            if(isInBoundThreshold(rect.bottom, boundBot)) {
                setIndex(i);
                break;
            }
        }
    }

    /**
     * Scrolls to an element in the ScrollList, so it is touching the bottom screen border.
     * If the passed index is invalid, do nothing.
     * @param index Element index of scroll container children.
     */
    function scrollTo(index: number) {
        const scrollChildren = scrollContainerRef.current!.children;
        if(index < 0 || index >= scrollChildren.length) return;

        const target = scrollChildren[index];
        target.scrollIntoView({ block: "end" });
        setIndex(index);
    }

    /**
     * Scrolls downwards, so the last element in the ScrollList is touching the bottom screen border.
     */
    function scrollToLast() {
        scrollTo(scrollContainerRef.current!.children.length - 1);
    }

    /**
     * Scrolls upwards/downwards and snaps the scrollbar onto the previous/next child element of the ScrollList.
     * @param scrollDown If true, scroll downwards and snap onto the next element. Otherwise, scroll upwards.
     */
    function scrollToNeighbor(scrollDown: boolean) {
        if(!scrollContainerRef) return;
        const scrollChildren = scrollContainerRef.current!.children;
        const boundLower = 1;   // Prevent scrolling to pad element (index 0)

        let indexNext;
        if(scrollDown) {
            indexNext = index + 1;
            if(indexNext >= scrollChildren.length) return;
        } else {
            indexNext = index - 1;
            if(indexNext < boundLower) return;
        }
        
        scrollTo(indexNext);
    }

    return (
        <div ref={scrollContainerRef} className="scrollList">
            <div className="scrollPadding" />
            {scrollListElements}
        </div>
    );
}

export default ScrollList