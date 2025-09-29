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
import Scrollbar from './Scrollbar';
import VirtualKeyboard from './VirtualKeyboard';
import type { CharRepresentation } from './CharRepresentation';
import { CharmapStates } from './CharmapStates';
import { CharmapLatin } from './CharmapLatin';
import { CharmapAccent } from './CharmapAccent';
import { CharmapJapaneseHiragana } from './CharmapJapaneseHiragana';
import { CharmapJapaneseKatakana } from './CharmapJapaneseKatakana';
import { CharmapSpecial } from './CharmapSpecial';
import { CharmapPicto } from './CharmapPicto';


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

const charmapLatin = new CharmapLatin();
const charmapAccent = new CharmapAccent();
const charmapHiragana = new CharmapJapaneseHiragana();
const charmapKatakana = new CharmapJapaneseKatakana();
const charmapSpecial = new CharmapSpecial();
const charmapPicto = new CharmapPicto();

function App() {
  const [canvasText, setCanvasText] = useState("");
  const [messageDisplays, setMessageDisplays] = useState<JSX.Element[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState("Unknown");
  const [selectedCharmap, setSelectedCharmap] = useState<CharmapBase>(charmapLatin);
  const [selectedCharmapState, setSelectedCharmapState] = useState(CharmapStates.LATIN);

  const floatingKeyRef = useRef(null);
  const canvasRef = useRef(null);
  const scrollListRef = useRef<any>(null);
  const scrollbarRef = useRef<any>(null);

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
          setCanvasText(prev => prev + "\b");
          break;
        case "space":
          setCanvasText(prev => prev + " ");
          break;
      }
    }
  }

  function handleCharmapButtonClick(charmapState: number) {
    if(charmapState === selectedCharmapState) return;

    switch(charmapState) {
      case CharmapStates.LATIN:
        setSelectedCharmap(charmapLatin);
        break;
      case CharmapStates.ACCENT:
        setSelectedCharmap(charmapAccent);
        break;
      case CharmapStates.JAPANESE_HIRAGANA:
        setSelectedCharmap(charmapHiragana);
        break;
      case CharmapStates.JAPANESE_KATAKANA:
        setSelectedCharmap(charmapKatakana);
        break;
      case CharmapStates.SPECIAL:
        setSelectedCharmap(charmapSpecial);
        break;
      case CharmapStates.PICTO:
        setSelectedCharmap(charmapPicto);
        break;
      default:
        return;
    }

    setSelectedCharmapState(charmapState);
  }

  function getBottomScrollMessage() {
    const index = scrollListRef.current.getBottomMessageIndex();
    if(index < 0 || index >= messages.length) return null;
    return messages[index];
  }

  function addMessage(message: Message) {
    setMessages(prev => [...prev, message]);

    const m = (
      <MessageDisplay key={"MessageDisplay-" + messageDisplays.length} message={message}/>
    );

    scrollbarRef.current!.addScrollsegment();
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
            <Scrollbar scrollbarRef={scrollbarRef}/>
          </div>
        </div>
        <div className="topRight">
          <div className="totalMessagesScreen">
            <ScrollList scrollListRef={scrollListRef} scrollListElements={messageDisplays} scrollbarRef={scrollbarRef} /> 
          </div>
        </div>


      </div>
      <div className="bottom">
        <div className="botLeft">
          <ButtonColumnLeft scrollListRef={scrollListRef} canvasRef={canvasRef}/>
        </div>
        <div className="botRight">
          <div className="botRightTop">
            <Canvas canvasText={canvasText} canvasRef={canvasRef} addMessage={addMessage} username={username} getBottomScrollMessage={getBottomScrollMessage}/>
          </div>
          <div className="botRightBot">
            <div className="emptyLeftKeyboardContainer"></div>
            <VirtualKeyboard 
              onKeyboardButtonClick={onKeyboardButtonClick} 
              floatingKeyRef={floatingKeyRef}
              charmap={selectedCharmap}
              charmapState={selectedCharmapState}
              />
            <div className="buttonColumnRightContainer">
              <ButtonColumnRight canvasRef={canvasRef} />
            </div>
            <div className="emptyRightKeyboardContainer" />
          </div>
        </div>
      </div>
      <FloatingKey floatingKeyRef={floatingKeyRef} canvasRef={canvasRef} />
    </>
  )
}

export default App
