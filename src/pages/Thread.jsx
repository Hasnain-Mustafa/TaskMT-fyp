
import React from 'react'
import { MultiChatSocket, MultiChatWindow, useMultiChatLogic } from "react-chat-engine-advanced";
const Thread = (props) => {

  console.log(props)
    const chatProps= useMultiChatLogic('3aaa4d2d-0861-41d8-8f8f-a69acdbad1f6',props.user.username, props.user.secret)
    return (
      <div  style={{ width: '100vw', height: '85vh' }}>
      <MultiChatSocket {...chatProps} />
      <MultiChatWindow {...chatProps} style={{height:'100%'}}/>
      </div>
  
  )
}

export default Thread