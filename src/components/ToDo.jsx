// import React from 'react'
import axios from "axios";
import { MdEdit } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { baseURL } from "../utils/constant";

// eslint-disable-next-line react/prop-types
const ToDo = ({text,id,setUpdateUI,setShowPopup,setPopupContent}) => {

  const deleteToDO = () => {
    axios.delete(`${baseURL}/delete/${id}`)
    .then(res => {
      console.log(res.data);
      setUpdateUI((prevState) => !prevState);
    })
  }

  const updateToDO = () => {
    setPopupContent({text,id})
    setShowPopup(true)
  }

  return (
    <div className="toDo">
      {text}
      <div className="icons">
         <MdEdit className="icon" onClick={updateToDO} /> 
         <RxCross1 className="icon" onClick={deleteToDO} />
      </div>
    </div>
  )
}

export default ToDo
