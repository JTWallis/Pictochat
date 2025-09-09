
export interface Props {

    onKeyboardButtonClick(char: string): void,
    floatingKeyRef: {
        current: {
            setPos(x: number, y: number): void;
        }    
    }
    

}