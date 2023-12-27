import { RxCross1 } from "react-icons/rx";
import { useState } from "react";
import axios from "axios";
import { baseURL } from "../utils/constant";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { useEffect } from "react";

// eslint-disable-next-line react/prop-types
const Popup = ({setShowPopup,popupContent,setUpdateUI}) => {
  
  // eslint-disable-next-line react/prop-types
  const [input,setInput] = useState(popupContent.text)

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

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
 
  const updateToDo = () => {
    // eslint-disable-next-line react/prop-types
    axios.put(`${baseURL}/update/${popupContent.id}`,{toDo : input})
    .then((res)=> {console.log(res.data)
    setUpdateUI((prev) => !prev);
    setShowPopup(false)
    });
  }

  return (
    <div className="backdrop">
      <div className="popup">
        <RxCross1 className="cross" onClick={() => setShowPopup(false)} />
        <h1>Update ToDo</h1>
        <div className="popup__input_holder">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Update ToDo..."/>
        <div className="buttonsinpopup buttons">
            <p className="mic">{listening ? '🎙️ On' : '🔴 Off'}</p>
            <button className="popupbts" onClick={updateToDo}>Update</button>
            <button className="popupbts" onClick={startListen}>Start</button>
            <button className="popupbts" onClick={SpeechRecognition.stopListening}>Stop</button>
            <button className="popupbts" onClick={resetAll}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup