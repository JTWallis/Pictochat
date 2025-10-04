import { useEffect, useRef, useState } from 'react';
import './MessageDisplay.css';
import type { Message } from './Message';
import Canvas from './Canvas';

function MessageDisplay( {message, findCharRepFromValue}: any ) {

    const canvasComponentRef = useRef<any>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const stripesContainerRef = useRef<HTMLDivElement>(null);
    const nameContainerRef = useRef<HTMLDivElement>(null);

    const [drawnLowest, setDrawnLowest] = useState(0.0);
    const [drawnStripeOffset, setDrawnStripeOffset] = useState(0);
    const [showStripes, setShowStripes] = useState(true);

    useEffect(() => {
        initHeight();
    }, []);

    /**
     * Scales the Canvas in steps of stripe heights, based on the drawing height.
     * Gets the lowest and highest position from all DrawingCommands and rounds them towards the last
     *   stripe height they would exceed or subceed.
     * Then calls applySizeStyles() to rescale the height of the Canvas- and Name container into px values.
     * When reconstructing a Message, it would then start from the Canvas beginning with an offset from the lowest
     *   exceeding stripe. The displayed Canvas is then as high as the drawing, with some extra height for the next stripe.
     */
    function initHeight() {
        if(!message) return;
        let lowestY = 1.0;
        let highestY = 0.0;
        let lowestX = 1.0;
        const drawingCommands = (message as Message).getCommands();

        // Find normalized, lowest and highest drawn position. 
        for(let i = 0; i < drawingCommands.length; i++) {
            const command = drawingCommands[i];
            const startY = command.getStartPos().y;
            const endY = command.getEndPos().y;
            if(startY >= 0.0) lowestY = Math.min(lowestY, command.getStartPos().y);
            if(endY >= 0.0) lowestY = Math.min(lowestY, command.getEndPos().y);
            if(startY <= 1.0) highestY = Math.max(highestY, command.getStartPos().y);
            if(endY <= 1.0) highestY = Math.max(highestY, command.getEndPos().y);

            lowestX = Math.min(lowestX, command.getStartPos().x);
            lowestX = Math.min(lowestX, command.getEndPos().x);
        }

        // Find normalized stripe positions.
        const stripeContainerChildren = stripesContainerRef.current!.children;
        const canvasRect = canvasContainerRef.current!.getBoundingClientRect();
        const canvasTop = canvasRect.top;
        const canvasHeight = canvasRect.height;
        let positions: number[] = [];
        for(let i = 0; i < stripeContainerChildren.length; i++) {
            const stripe = stripeContainerChildren[i];
            const rect = stripe.getBoundingClientRect();
            positions.push((rect.bottom - canvasTop) / canvasHeight);
        }

        // Find lowest stripe pos that the lowest drawing pos exceeds
        //   and lowest stripe pos that the highest drawing pos subceeds.
        positions = [0.0, ...positions, 1.0];
        let lowestStripePos = 0;
        let highestStripePos = 1.0;

        let k;
        for(k = 0; k < positions.length; k++) {
            if(lowestY >= positions[k]) {
                lowestStripePos = positions[k];
            } else {
                break;
            }
        }

        for(let i = positions.length - 1; i >= 0; i--) {
            if(highestY <= positions[i]) {
                highestStripePos = positions[i];
            } else {
                break;
            }
        }

        // Check if the lowest drawn stroke would have a higher y-pos than the name container
        //   but the overall lowest x-pos would horizontally overlap.
        //   In that case, decrement the lowestStripePos by one step,
        //   so a drawing would not be accidentally hidden behind the name container.
        const nameRect = nameContainerRef.current!.getBoundingClientRect();
        const nameBottom = nameRect.bottom - canvasTop
        const nameRight = nameRect.right - canvasRect.left;
        const unnormLowY = lowestY * canvasHeight;
        const unnormLowX = lowestX * canvasRect.width;
        if(unnormLowY >= nameBottom && unnormLowX <= nameRight) {
            k -= 2;
            if(k >= 0) lowestStripePos = positions[k];
        }

        const stripeHeight = highestStripePos - lowestStripePos;

        setDrawnLowest(lowestY);
        setDrawnStripeOffset(lowestY - lowestStripePos);
        setShowStripes(false);

        applySizeStyles(stripeHeight);
    }

    return (
        <div 
            className={className} 
            ref={canvasContainerRef}>
        </div>
    );
}


export default MessageDisplay