
import React from 'react'
import { MultiChatSocket, MultiChatWindow, useMultiChatLogic } from "react-chat-engine-advanced";
const Thread = (props) => {

  console.log(props)
    const chatProps= useMultiChatLogic('5417960f-874e-4903-8cf7-407ebd2faab2',props.user.username, props.user.secret)
    return (
      <div  style={{ width: '100vw', height: '85vh' }}>
      <MultiChatSocket {...chatProps} />
      <MultiChatWindow {...chatProps} style={{height:'100%'}}/>
      </div>
  
  )
}

export default Thread