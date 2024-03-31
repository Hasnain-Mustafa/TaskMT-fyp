
import React  from 'react'
import {useSelector} from 'react-redux'
import { MultiChatSocket, MultiChatWindow, useMultiChatLogic } from "react-chat-engine-advanced";
const Thread = () => {
  const { userInfo } = useSelector((state) => state.auth);
 

    const chatProps= useMultiChatLogic('d4c68a5d-122e-495f-9108-5e7180ea035d',userInfo.name, userInfo.name)
    return (
      
      <div  style={{ width: '100vw', height: '85vh' }}>
       
      {/* <MultiChatSocket {...chatProps} /> */}
      <MultiChatWindow {...chatProps} style={{height:'100%'}}/>
      </div>
  
  )
}

export default Thread