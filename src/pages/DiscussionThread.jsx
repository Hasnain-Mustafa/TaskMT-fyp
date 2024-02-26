// import React, { useState, useRef, useEffect } from 'react';
// import { FaPaperclip, FaDownload } from 'react-icons/fa';
// import avatar from '../data/avatar.jpg';

// const DiscussionThread = () => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const footerRef = useRef(null);
//   const currentUser = {
//     name: "Me",
//     profilePicture: avatar // Add the path to the profile picture
//   };

//   const websocket = useRef(null);

//   useEffect(() => {
//     websocket.current = new WebSocket('ws://localhost:8080');

//     websocket.current.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       if (message.sender.name === currentUser.name) {
//         setMessages(prevMessages => [...prevMessages, message]);
//       } else {
//         const originalMessage = { ...message };
//         delete originalMessage.content;
//         const replyMessage = { ...message };
//         delete replyMessage.id;
//         delete replyMessage.file;
//         delete replyMessage.content;
//         setMessages(prevMessages => [...prevMessages, originalMessage, replyMessage]);
//       }
//     };

//     return () => {
//       websocket.current.close();
//     };
//   }, []);

//   const handleSendMessage = () => {
//     if (newMessage.trim() !== '' || selectedFile) {
//       const newMessageObject = {
//         id: messages.length + 1,
//         content: newMessage,
//         file: selectedFile,
//         timestamp: new Date().toLocaleString(),
//         sender: currentUser
//       };

//       setMessages([...messages, newMessageObject]);
//       websocket.current.send(JSON.stringify(newMessageObject));

//       setNewMessage('');
//       setSelectedFile(null);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file && (!selectedFile || file.name !== selectedFile.name)) {
//       setSelectedFile(file);
//     } else if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleDownloadFile = (file) => {
//     const url = URL.createObjectURL(file);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = file.name;
//     document.body.appendChild(a);
//     a.click();
//     URL.revokeObjectURL(url);
//     document.body.removeChild(a);
//   };

//   useEffect(() => {
//     if (footerRef.current) {
//       footerRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   const fileInputRef = useRef(null);

//   const handleCancelFile = () => {
//     setSelectedFile(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
//       <div className="flex-grow overflow-y-auto">
//         {messages.map((message, index) => (
//           <div key={message.id} className={`flex justify-end mb-2 ${message.sender === currentUser ? 'items-end' : 'items-start'}`}>
//             <div className={`rounded-lg p-3 max-w-md ${message.sender === currentUser ? 'bg-gray-200 text-black' : 'bg-blue-500 text-white'}`}>
//               <div className="flex items-center mb-1">
//                 <img src={message.sender.profilePicture} alt="Profile" className="w-6 h-6 rounded-full mr-2" />
//                 <span>{message.sender.name}</span>
//               </div>
//               {message.content && <div className="text-sm">{message.content}</div>}
//               {message.file && (
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm">{message.file.name}</span>
//                   {message.sender === currentUser && (
//                     <FaDownload onClick={() => handleDownloadFile(message.file)} className="text-blue-500 cursor-pointer" />
//                   )}
//                 </div>
//               )}
//               <div className="text-xs text-gray-600">{message.timestamp}</div>
//             </div>
//           </div>
//         ))}
//         <div ref={footerRef}></div>
//       </div>
//       <div className="p-4 border-t border-gray-300 flex flex-col items-start">
//         <textarea
//           value={newMessage}
//           onChange={e => setNewMessage(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message here..."
//           className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full"
//         />
//         {selectedFile && (
//           <div className="flex items-center space-x-2 text-sm">
//             <span className="truncate">{selectedFile.name}</span>
//             <button onClick={handleCancelFile} className="text-red-500 hover:text-red-700 focus:outline-none">
//               Cancel
//             </button>
//           </div>
//         )}
//         <div className="flex items-center mt-2">
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleFileUpload}
//             style={{ display: 'none' }}
//           />
//           <button onClick={() => fileInputRef.current.click()} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-lg cursor-pointer mr-2 hover:bg-gray-300">
//             <FaPaperclip />
//           </button>
//           <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Send</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DiscussionThread;
import React from 'react'
// import { PrettyChatWindow } from "react-chat-engine-pretty";
import {MultiChatSocket, MultiChatWindow,useMultiChatLogic} from "react-chat-engine-advanced";
const DiscussionThread = (props) => {
  const chatProps= useMultiChatLogic('28813ce8-4170-4909-9eab-138b478e67f4',props.user.username, props.user.secret)
  return (
    <div style={{ width: '80vw', height: '92vh' }}>
    <MultiChatSocket {...chatProps}/>
    <MultiChatWindow {...chatProps} style={{height:'100%'}}/>
    </div>

  )
}
export default DiscussionThread;

