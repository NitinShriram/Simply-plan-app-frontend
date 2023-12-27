import '@babel/polyfill';
import { useEffect, useState } from "react";
import ToDo from "./components/ToDo";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
//rafce
import axios from "axios";
import { baseURL } from "./utils/constant";
import Popup from "./components/Popup";
// ... (imports and other code)

const App = () => {
  const [toDos, setToDos] = useState([]);
  const [input1, setInput] = useState("");
  const [updateUI, setUpdateUI] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({});

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    axios
      .get(`${baseURL}/get`)
      .then((res) => setToDos(res.data))
      .catch((err) => console.log(err));
  }, [updateUI]);

  useEffect(() => {
    // Update input1 when transcript changes
    setInput(transcript);
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  const resetAll = () => {
    resetTranscript(); // Clear voice transcript
    setInput(""); // Clear typed text
  };
  const startListen = () => {
    SpeechRecognition.startListening({ continuous: true })
  }

  const saveToDo = () => {
    // Prevent saving empty to-do items
    if (input1.trim() !== "") {
      axios
        .post(`${baseURL}/save`, { toDo: input1 })
        .then((res) => {
          console.log(res.data);
          setUpdateUI((prevState) => !prevState);
          resetTranscript();
          setInput("");
        })
        .catch((err) => console.log(err));
     }
  };

  return (
    <main>
      <div className="container">
        <h1 className="title">Simply Plan</h1>

        <div className="input_holder">
          <input
            type="text"
            value={input1 || transcript}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a ToDo..."
          />
          <div className="buttons">
            <p className="mic">{listening ? '🎙️ On' : '🔴 Off'}</p>
            <button onClick={saveToDo}>Add</button>
            <button onClick={startListen}>Start</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetAll}>Reset</button>
          </div>
        </div>
        <div className="list">
          {toDos.map((el) => (
            <ToDo
              key={el._id}
              text={el.toDo}
              id={el._id}
              setUpdateUI={setUpdateUI}
              setShowPopup={setShowPopup}
              setPopupContent={setPopupContent}
            />
          ))}
        </div>
      </div>
      {showPopup && (
        <Popup
          setShowPopup={setShowPopup}
          popupContent={popupContent}
          setUpdateUI={setUpdateUI}
        />
      )}
    </main>
  );
};

export default App;
