import { useContext, useEffect, useImperativeHandle, useRef, type JSX } from 'react';
import './ScrollList.css';
import { ThemeContext } from '@contexts/ThemeContext';
import type { ScrollbarHandle } from '@components/scrollbar/Scrollbar';

type ScrollListProps = {
    ref: React.Ref<ScrollListHandle>;
    scrollListElements: JSX.Element[];
    scrollbarRef: React.RefObject<ScrollbarHandle | null>;
}

export type ScrollListHandle = {
    scrollDown: () => void;
    scrollUp: () => void;
    getBottomMessageIndex: () => number;
}

function ScrollList(props: ScrollListProps ) {

    const theme = useContext(ThemeContext);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    let scrollIndex = 0;

    useImperativeHandle(props.ref, () => ({
        scrollDown: () => {
            const scrollDown = true;
            scrollToNeighbor(scrollDown);
        },

        scrollUp: () => {
            const scrollDown = false;
            scrollToNeighbor(scrollDown);
        },

        getBottomMessageIndex: () => {
            return scrollIndex - 1;
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
    }, [props.scrollListElements]);

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
                scrollIndex = i;
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
        scrollIndex = index;

        // Decremented index because first padding element is not part of Scrollbar.
        
    }

    /**
     * Scrolls downwards, so the last element in the ScrollList is touching the bottom screen border.
     */
    function scrollToLast() {
        scrollTo(scrollContainerRef.current!.children.length - 1);
        props.scrollbarRef.current!.scrollReset();
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
            indexNext = scrollIndex + 1;
            if(indexNext >= scrollChildren.length) return;
            props.scrollbarRef.current!.scrollDown();
        } else {
            indexNext = scrollIndex - 1;
            if(indexNext < boundLower) return;
            props.scrollbarRef.current!.scrollUp();
        }
        
        scrollTo(indexNext);
    }

    return (
        <div ref={scrollContainerRef} className="scrollList" style={{backgroundColor: theme.background_primary}}>
            <div className="scrollPadding" style={{backgroundColor: theme.background_primary}} />
            {props.scrollListElements}
        </div>
    );
}

export default ScrollList