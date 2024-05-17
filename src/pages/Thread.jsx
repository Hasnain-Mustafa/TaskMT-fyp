import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import avatar from "../data/avatar.jpg";
import { getCurrentFormattedTime } from "../utils/utils";
import { ChatEngine } from "react-chat-engine";
import { gql } from "@apollo/client";
import client from "../ApolloClient";
import { chatNotifications } from "../features/auth/authActions";
const Thread = () => {
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);
  const dispatch = useDispatch();

  const pushNotification = async (chatId, message) => {
    console.log(message);
    const chatMembersUrl = `https://api.chatengine.io/chats/${chatId}/people/`;
    try {
      const response = await fetch(chatMembersUrl, {
        method: "GET",
        headers: {
          "Project-ID": "431543cd-73a5-419c-966f-c902b35319ad",
          "User-Name": userInfo.name,
          "User-Secret": userInfo.name,
        },
      });
      const data = await response.json();
      const emails = data?.map((person) => person.person.first_name); // assuming email is stored as first_name
      console.log(emails); // Assuming the response has a `members` key
      const userIds = [];

      for (const email of emails) {
        // Assuming email is stored as first_name
        const userId = await fetchUserIdByEmail(email);
        if (userId) userIds.push(userId);
      }
      console.log(userIds);
      // Dispatching notification for each user
      userIds.forEach((id) => {
        dispatch(
          chatNotifications({
            chat: {
              userId: id,
              image: avatar, // Ensure 'avatar' is defined or imported
              message: "New message received",
              sender: message.sender.first_name,
              desc: `${message.sender_username} sent you a new message!`,
              time: getCurrentFormattedTime(), // Ensure this function is defined or imported
            },
          })
        );
      });
    } catch (error) {
      console.error(
        "Failed to fetch chat members or dispatch notifications:",
        error
      );
    }
  };
  const fetchUserIdByEmail = async (email) => {
    try {
      const { data } = await client.query({
        query: gql`
          query GetUserByEmail($email: String!) {
            getUserByEmail(email: $email) {
              id
            }
          }
        `,
        variables: { email: email },
      });
      return data.getUserByEmail.id;
    } catch (error) {
      console.error("Error fetching member IDs:", error);
      return null;
    }
  };

  return (
    <div>
      <ChatEngine
        projectID="431543cd-73a5-419c-966f-c902b35319ad"
        userName={userInfo.name}
        userSecret={userInfo.name}
        onNewMessage={(chatId, message) => pushNotification(chatId, message)}
        height="100vh"
      />
    </div>
  );
};

export default Thread;
