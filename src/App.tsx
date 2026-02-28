import './App.css'
import ButtonColumnLeft from './ButtonColumnLeft';
import FloatingKey from './FloatingKey';
import { useEffect, useRef, useState, type JSX } from 'react';
import type { Props } from './Props';
import ScrollList from './ScrollList';
import type { Message } from '@models/Message';
import ButtonColumnRight from './ButtonColumnRight';
import Scrollbar from './Scrollbar';
import VirtualKeyboard from './VirtualKeyboard';
import type { CharRepresentation } from '@models/charrepresentations/CharRepresentation';
import { CharmapBase } from '@models/charmaps/base/CharmapBase';
import type { CharmapBaseJapanese } from '@models/charmaps/base/CharmapBaseJapanese';
import { CharmapStates } from './CharmapStates';
import { CharmapLatin } from '@models/charmaps/implementations/CharmapLatin';
import { CharmapAccent } from '@models/charmaps/implementations/CharmapAccent';
import { CharmapJapaneseHiragana } from '@models/charmaps/implementations/CharmapJapaneseHiragana';
import { CharmapJapaneseKatakana } from '@models/charmaps/implementations/CharmapJapaneseKatakana';
import { CharmapSpecial } from '@models/charmaps/implementations/CharmapSpecial';
import { CharmapPicto } from '@models/charmaps/implementations/CharmapPicto';
import MessageSketch from './MessageSketch';
import MessageDisplay from './MessageDisplay';
import MessageSpecial from './MessageSpecial';
import { createMessageTextJoin, createMessageTextWelcome, createSpecialMesssage } from './MessageSpecialHelper';
import convertTextToCharRepresentations from '@utils/CharmapHelper';
import { registerUsername, startClient, subscribeQueueReply } from './StompClient';
import { subscribeMessages } from './MessageController';
import { subscribeTotalConnections, subscribeRoomConnections } from './UserConnectionController';
import type { MessageFetchDto } from './MessageFetchDto';
import type { UserRegisterDto } from './UserRegisterDto';
import { themes, type Theme, ThemeContext } from './ThemeContext'

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

function debugRandomUser() {
  const name = prompt("Please enter username:");
  if(name && name.length > 0) return name;

  const str = performance.now().toString();
  const last = str.charAt(str.length - 1);

  switch(last) {
    case '0':
      return "Gustavo";
    case '1':
      return "Max";
    case '2':
      return "John";
    case '3':
      return "Liam";
    case '4':
      return "Etna";
    case '5':
      return "Mia";
    case '6':
      return "Andy";
    case '7':
      return "Fred";
    case '8':
      return "Dirk";
    case '9':
      return "Olaf";
    default:
      return "Unknown";
  }
}

const debugLocalStorageUser = localStorage.getItem("username");
const debugUser = debugLocalStorageUser ? debugLocalStorageUser : debugRandomUser();
localStorage.setItem("username", debugUser);

const rooms = ['a', 'b', 'c', 'd'];

function App() {
  const [canvasText, setCanvasText] = useState("");
  const [messageDisplays, setMessageDisplays] = useState<JSX.Element[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState(debugUser);
  const [userColor, setUserColor] = useState("#080");
  const [selectedCharmap, setSelectedCharmap] = useState<CharmapBase>(charmapLatin);
  const [selectedCharmapState, setSelectedCharmapState] = useState(CharmapStates.LATIN);
  const [roomsUserCount, setRoomsUserCount] = useState<number[]>(rooms.map((_) => 0));
  const [theme, setTheme] = useState<Theme>(themes.light)

  const uuidRef = useRef<string>("");
  const floatingKeyRef = useRef<any>(null);
  const canvasSketchRef = useRef<any>(null);
  const scrollListRef = useRef<any>(null);
  const scrollbarRef = useRef<any>(null);
  const vkeyboardStaggeredRef = useRef<any>(null);

  function initStompClient() {
    startClient(stompClientConnectedCallback);
  }

  function stompClientConnectedCallback() {
    registerUsername(username, stompClientRegisteredCallback);
  }

  function stompClientRegisteredCallback(userRegisterDto: UserRegisterDto) {
    console.log(`Register Callback with uuid ${userRegisterDto.uuid}`);
    uuidRef.current = userRegisterDto.uuid
    subscribeQueueReply();

    subscribeTotalConnections(setRoomsUserCount);
    
    subscribeRoomConnections("a", addFetchedNewSpecialMessage);
    subscribeMessages(addFetchedMessage);
  }

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
      const charRep = findCharRepFromValue(key);
      if(!charRep) return;
      canvasSketchRef.current.createDrawImgAppend(charRep.src, key, "#000");
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

  function convertTextToCharReps(text: string) {
    const charmaps: CharmapBase[] = [charmapLatin, charmapSpecial, charmapPicto, charmapAccent, charmapHiragana, charmapKatakana];
    return convertTextToCharRepresentations(charmaps, text);
  }

  function addMessageElement(messageElement: JSX.Element, isSpecial: boolean) {
    scrollbarRef.current!.addScrollsegment(isSpecial);
    setMessageDisplays((prev) => [...prev, messageElement]);
  }

  function addFetchedNewSpecialMessage(messageText: string, creatorUuid: string) {
    if(isUuidEqual(creatorUuid)) {
      return;
    }

    addNewSpecialMessage(messageText);
  }

  function addNewSpecialMessage(messageText: string) {
    if(messageText.length === 0) return;

    const message = createSpecialMesssage(username);

    const specialMessage = (
      <MessageSpecial 
        key={"MessageSpecial-" + messageDisplays.length + "-" + crypto.randomUUID()}
        message={message} 
        messageText={messageText}
        textColor={"#DDD"}
        findCharRepFromValue={findCharRepFromValue}
        convertTextToCharReps={convertTextToCharReps} 
      />
    )

    setMessages(prev => [...prev, message]);
    const isSpecial = true;
    addMessageElement(specialMessage, isSpecial);
  }

  function addFetchedMessage(message: MessageFetchDto) {
    if(isUuidEqual(message.creatorUuid)) {
      return;
    }

    const msg = message.toMessage();

    addMessage(msg)
  }

  function addMessage(message: Message) {
    setMessages(prev => [...prev, message]);

    const m = (
        <MessageDisplay key={"MessageDisplay-" + messageDisplays.length + "-" + crypto.randomUUID()}
          message={message}
          findCharRepFromValue={findCharRepFromValue}/>
      );

    const isSpecial = false;
    addMessageElement(m, isSpecial);
  }

  function isUuidEqual(uuid: string) {
    return uuid === uuidRef.current;
  }


  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    addNewSpecialMessage(createMessageTextWelcome());
    addNewSpecialMessage(createMessageTextJoin(username, "a"));
    initStompClient();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      // DisconnectStompClient
    }
  }, []);

  return (
    <>
    <ThemeContext.Provider value={theme}>
        <div className="top">
          <div className="topLeft">

            <div className="scrollwheel">
              <Scrollbar scrollbarRef={scrollbarRef}/>
            </div>
          </div>
          <div className="topRight" style={{backgroundColor: theme.background_primary}}>
            <div className="totalMessagesScreen">
              <ScrollList scrollListRef={scrollListRef} scrollListElements={messageDisplays} scrollbarRef={scrollbarRef} /> 
            </div>
          </div>


        </div>
        <div className="bottom">
          <div className="botLeft">
            <ButtonColumnLeft 
              userColor={userColor}
              scrollListRef={scrollListRef}
              canvasSketchRef={canvasSketchRef}
              onCharmapButtonClick={handleCharmapButtonClick}
            />
          </div>
          <div className="botRight">
            <div className="botRightTop" style={{backgroundColor: theme.background_primary}}>
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
            <div className="botRightBot" style={{backgroundColor: theme.background_secondary}}>
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
      </ThemeContext.Provider>
    </>
  )
}

export default App
