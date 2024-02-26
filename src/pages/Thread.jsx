
import React from 'react'
import { MultiChatSocket, MultiChatWindow, useMultiChatLogic } from "react-chat-engine-advanced";
const Thread = (props) => {

    const chatProps= useMultiChatLogic('28813ce8-4170-4909-9eab-138b478e67f4',props.user.username, props.user.secret)
    return (
      <div  style={{ width: '100vw', height: '85vh' }}>
      <MultiChatSocket {...chatProps} />
      <MultiChatWindow {...chatProps} style={{height:'100%'}}/>
      </div>
  
  )
}

export default Thread