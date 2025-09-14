import { useImperativeHandle, useRef, useState } from 'react';
import './ScrollList.css';

function ScrollList( {scrollListRef, children}: any ) {

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [indexTop, setIndexTop] = useState(0);
    const [indexBot, setIndexBot] = useState(0);

    useImperativeHandle(scrollListRef, () => ({
        scrollNext: () => {
            console.log("SCROLLNEXT");
            const scrollNext = true;
            scrollToNeighbor(scrollNext);
        },

        scrollPrev: () => {
            console.log("SCROLLPREV");
            const scrollNext = false;
            scrollToNeighbor(scrollNext);
        }
    }));

    function scrollToNeighbor(scrollNext: boolean) {
        if(!scrollContainerRef) return;
        const children = scrollContainerRef.current!.children;

        let indexNext;
        if(scrollNext) {
            indexNext = indexBot + 1;
            if(indexNext >= children.length) return;
            setIndexBot(indexNext);
            // Check if indexTop is still in view.
        } else {
            indexNext = indexTop - 1;
            if(indexNext < 0) return;
            setIndexTop(indexNext);
            // Check if indexBot is still in view.
        }

        const target = children[indexNext];
        target.scrollIntoView();
    }

    return (
        <div ref={scrollContainerRef} className="scrollList">
            {children}
        </div>
    );
}

export default ScrollList