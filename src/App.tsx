import './App.css'
import ButtonColumnLeft from './ButtonColumnLeft';
import FloatingKey from './FloatingKey';
import { useEffect, useRef, useState, type JSX } from 'react';
import type { Props } from './Props';
import ScrollList from './ScrollList';
import type { Message } from './Message';
import ButtonColumnRight from './ButtonColumnRight';
import Scrollbar from './Scrollbar';
import VirtualKeyboard from './VirtualKeyboard';
import type { CharRepresentation } from './CharRepresentation';
import { CharmapBase } from './CharmapBase';
import type { CharmapBaseJapanese } from './CharmapBaseJapanese';
import { CharmapStates } from './CharmapStates';
import { CharmapLatin } from './CharmapLatin';
import { CharmapAccent } from './CharmapAccent';
import { CharmapJapaneseHiragana } from './CharmapJapaneseHiragana';
import { CharmapJapaneseKatakana } from './CharmapJapaneseKatakana';
import { CharmapSpecial } from './CharmapSpecial';
import { CharmapPicto } from './CharmapPicto';
import MessageSketch from './MessageSketch';
import MessageDisplay from './MessageDisplay';
import MessageSpecial from './MessageSpecial';
import { createMessageWelcome } from './MessageSpecialHelper';


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

const KEY_SHIFT = "Shift";
const KEY_CAPS = "CapsLock";

function App() {
  const [canvasText, setCanvasText] = useState("");
  const [messageDisplays, setMessageDisplays] = useState<JSX.Element[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState("Unknown");
  const [selectedCharmap, setSelectedCharmap] = useState<CharmapBase>(charmapLatin);
  const [selectedCharmapState, setSelectedCharmapState] = useState(CharmapStates.LATIN);

  const floatingKeyRef = useRef<any>(null);
  const canvasSketchRef = useRef<any>(null);
  const scrollListRef = useRef<any>(null);
  const scrollbarRef = useRef<any>(null);
  const vkeyboardStaggeredRef = useRef<any>(null);

  function onKeyDown(event: any) {
    switch(event.key) {
      case KEY_SHIFT:
        vkeyboardStaggeredRef.current.onShiftDown();
        break;
      case KEY_CAPS:
        vkeyboardStaggeredRef.current.onCapsDown();
        break;
      default:
        handleKeyDown(event.key);
        break;
    }
  }

  function onKeyUp(event: any) {
    switch(event.key) {
      case KEY_SHIFT:
        vkeyboardStaggeredRef.current.onShiftUp();
        break;
      default:
        break;
    }
  }

  function onKeyboardButtonClick(e: any) {
    switch(e.target.value) {
      case "HIRAGANA":
        handleCharmapButtonClick(CharmapStates.JAPANESE_HIRAGANA);
        break;
      case "KATAKANA":
        handleCharmapButtonClick(CharmapStates.JAPANESE_KATAKANA);
        break;
      case "゛":
      case "゜":
      case "SMALL":
        transformKana(e.target.value);
        break;
      default:
        handleKeyDown(e.target.value);
        break;
    }
  }

  function transformKana(transformType: string): void {
    const lastChar = canvasSketchRef.current!.getLastTextValue();
    if(!lastChar) return;

    const transformedChar = (selectedCharmap as CharmapBaseJapanese).getTransformedRepresentation(lastChar, transformType);
    if(!transformedChar) return;

    canvasSketchRef.current!.replaceLastTextValue(transformedChar.value);
  }

  function handleKeyDown(key: string) {
    if (isKeyValidChar(key)) {
      setCanvasText(prev => prev + key);
      floatingKeyRef.current.applyImmediate(findCharRepFromValue(key)!.src, key);
    } else {
      switch (key.toLowerCase()) {
        case "enter":
          break;
        case "backspace":
        case "back":
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

  function findCharRepFromValue(value: string): CharRepresentation | undefined {
    if(value.length === 0) return undefined;

    const charmaps: CharmapBase[] = [charmapLatin, charmapAccent, charmapHiragana, charmapKatakana, charmapSpecial, charmapPicto];

    let foundValue;
    charmaps.every(charmap => {
      foundValue = charmap.findRepresentation(value);
      return (foundValue === undefined);
    });

    return foundValue;
  }

  function addMessage(message: Message) {
    setMessages(prev => [...prev, message]);

    const m = message.isSpecialMessage() ? 
      (
        <MessageSpecial key={"MessageSpecial-" + messageDisplays.length} message={message} findCharRepFromValue={findCharRepFromValue} />
      )
      :
      (
        <MessageDisplay key={"MessageDisplay-" + messageDisplays.length} message={message} findCharRepFromValue={findCharRepFromValue}/>
      );

    scrollbarRef.current!.addScrollsegment();
    setMessageDisplays((prev) => [...prev, m]);
  }


  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    addMessage(createMessageWelcome(username));

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
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
          <ButtonColumnLeft scrollListRef={scrollListRef} canvasSketchRef={canvasSketchRef} onCharmapButtonClick={handleCharmapButtonClick}/>
        </div>
        <div className="botRight">
          <div className="botRightTop">
            <MessageSketch 
              canvasSketchRef={canvasSketchRef}
              floatingKeyRef={floatingKeyRef}
              username={username}
              canvasText={canvasText}
              getBottomScrollMessage={getBottomScrollMessage}
              findCharRepFromValue={findCharRepFromValue}
              addMessage={addMessage}
            />
          </div>
          <div className="botRightBot">
            <div className="emptyLeftKeyboardContainer"></div>
            <VirtualKeyboard 
              vkeyboardStaggeredRef={vkeyboardStaggeredRef}
              onKeyboardButtonClick={onKeyboardButtonClick} 
              floatingKeyRef={floatingKeyRef}
              charmap={selectedCharmap}
              charmapState={selectedCharmapState}
              />
            <div className="buttonColumnRightContainer">
              <ButtonColumnRight canvasSketchRef={canvasSketchRef} />
            </div>
            <div className="emptyRightKeyboardContainer" />
          </div>
        </div>
      </div>
      <FloatingKey floatingKeyRef={floatingKeyRef} canvasSketchRef={canvasSketchRef} />
    </>
  )
}

export default App
