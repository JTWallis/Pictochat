import { useEffect, useRef } from 'react';
import type { CanvasDisplayAPI } from '../CanvasAPI';

type CanvasDisplayProps = {
    className: string,
    api: CanvasDisplayAPI
}

function CanvasDisplay(props: CanvasDisplayProps ) {

    const canvasContainerRef = useRef<HTMLDivElement>(null);

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
        let lowestY = 1.0;
        let highestY = 0.0;
        let lowestX = 1.0;
        const drawingCommands = props.api.getMessageCommands();

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
        const stripeRects = props.api.getStripeRects();
        const canvasRect = canvasContainerRef.current!.getBoundingClientRect();
        const canvasTop = canvasRect.top;
        const canvasHeight = canvasRect.height;
        let positions: number[] = [];
        for(let i = 0; i < stripeRects.length; i++) {
            const rect = stripeRects[i];
            positions.push((rect.bottom - canvasTop) / canvasHeight);
        }

        // Find lowest stripe pos that the lowest drawing pos exceeds
        //   and lowest stripe pos that the highest drawing pos subceeds.
        positions = [0.0, ...positions, 1.0];
        let lowestStripePos = 0;
        let highestStripePos = 1.0;

        let lowestStripeIndex;
        for(lowestStripeIndex = 0; lowestStripeIndex < positions.length; lowestStripeIndex++) {
            if(lowestY >= positions[lowestStripeIndex]) {
                lowestStripePos = positions[lowestStripeIndex];
            } else {
                lowestStripeIndex--;
                break;
            }
        }

        let highestStripeIndex;
        for(highestStripeIndex = positions.length - 1; highestStripeIndex >= 0; highestStripeIndex--) {
            if(highestY <= positions[highestStripeIndex]) {
                highestStripePos = positions[highestStripeIndex];
            } else {
                highestStripeIndex++;
                break;
            }
        }

        // Check if the lowest drawn stroke would have a higher y-pos than the name container
        //   but the overall lowest x-pos would horizontally overlap.
        //   In that case, decrement the lowestStripePos by one step,
        //   so a drawing would not be accidentally hidden behind the name container.
        const nameRect = props.api.getNameRect();
        if(nameRect) {
            const nameBottom = nameRect.bottom - canvasTop
            const nameRight = nameRect.right - canvasRect.left;
            const unnormLowY = lowestY * canvasHeight;
            const unnormLowX = lowestX * canvasRect.width;
            if(unnormLowY >= nameBottom && unnormLowX <= nameRight) {
                lowestStripeIndex--;
                if(lowestStripeIndex >= 0) lowestStripePos = positions[lowestStripeIndex];
            }
        }

        const stripeSteps = highestStripeIndex - lowestStripeIndex;

        props.api.setDrawOffsetY(lowestStripePos);
        props.api.setStripeSteps(stripeSteps);
        props.api.setRenderStripes(false);
    }

    return (
        <div 
            className={props.className} 
            ref={canvasContainerRef}>
        </div>
    );
}


export default CanvasDisplay