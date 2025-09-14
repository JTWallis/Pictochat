import './App.css'
import ButtonColumnLeft from './ButtonColumnLeft';
import Canvas from './Canvas'
import FloatingKey from './FloatingKey';
import Keyboard from './Keyboard'
import { useEffect, useRef, useState, type JSX } from 'react';
import type { Props } from './Props';
import MessageDisplay from './MessageDisplay';
import ScrollList from './ScrollList';
import type { Message } from './Message';
import ButtonColumnRight from './ButtonColumnRight';


function isAlpha(char: string): boolean {
  return ((char >= "a" && char <= "z") || (char >= "A" && char <= "Z"));
}

function isNumeric(char: string): boolean {
  return char >= "0" && char <= "9";
}

function isSpecialSupported(char: string): boolean {
  const supported = [",", ".", "/", ";", "´", "[", "]", " "];
  return supported.includes(char);
}

function isKeyValidChar(char: string) {
  return char.length === 1 &&
    (isAlpha(char) || isNumeric(char) || isSpecialSupported(char));
}


function App() {
  const [canvasText, setCanvasText] = useState("");
  const [messageDisplays, setMessageDisplays] = useState<JSX.Element[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState("Unknown");

  const floatingKeyRef = useRef(null);
  const canvasRef = useRef(null);
  const scrollListRef = useRef<any>(null);

  function onKeyDown(event: any) {
    handleKeyDown(event.key);
  }

  function onKeyboardButtonClick(char: any) {
    handleKeyDown(char);
  }

  function handleKeyDown(key: string) {
    if (isKeyValidChar(key)) {
      setCanvasText(prev => prev + key);
    } else {
      switch (key.toLowerCase()) {
        case "enter":
          break;
        case "backspace":
          setCanvasText(prev => prev.substring(0, prev.length - 1));
          break;
        case "space":
          setCanvasText(prev => prev + " ");
          break;
      }
    }
  }

  function getBottomScrollMessage() {
    const index = scrollListRef.current.getBottomMessageIndex();
    return messages[index];
  }

  function addMessage(message: Message) {
    setMessages(prev => [...prev, message]);

    const m = (
      <MessageDisplay key={"MessageDisplay-" + messageDisplays.length} message={message}/>
    );

    setMessageDisplays((prev) => [...prev, m]);
  }


  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    }
  }, []);

  return (
    <>
      <div className="top">
        <div className="topLeft">

          <div className="scrollwheel">

          </div>
        </div>
        <div className="topRight">
          <div className="totalMessagesScreen">
            <ScrollList scrollListRef={scrollListRef} scrollListElements={messageDisplays} /> 
          </div>
        </div>


      </div>
      <div className="bottom">
        <div className="botLeft">
          <ButtonColumnLeft scrollListRef={scrollListRef}/>
        </div>
        <div className="botRight">
          <div className="botRightTop">
            <Canvas canvasText={canvasText} canvasRef={canvasRef} addMessage={addMessage} username={username} getBottomScrollMessage={getBottomScrollMessage}/>
          </div>
          <div className="botRightBot">
            <div className="emptyLeftKeyboardContainer"></div>
            <div className="keyboardContainer">
              <Keyboard onKeyboardButtonClick={onKeyboardButtonClick} floatingKeyRef={floatingKeyRef} className="keyboardComponent"/>
            </div>
            <div className="buttonColumnRightContainer">
              <ButtonColumnRight canvasRef={canvasRef} />
            </div>
          </div>
        </div>
      </div>
      <FloatingKey floatingKeyRef={floatingKeyRef} canvasRef={canvasRef} />
    </>
  )
}

export default App
