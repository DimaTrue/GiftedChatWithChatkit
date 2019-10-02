import React from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';

import {
  CHATKIT_TOKEN_PROVIDER_ENDPOINT,
  CHATKIT_INSTANCE_LOCATOR,
  CHATKIT_ROOM_ID,
  CHATKIT_USER_NAME,
} from './keys/keys';

export default class MyChat extends React.Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    const tokenProvider = new TokenProvider({
      url: CHATKIT_TOKEN_PROVIDER_ENDPOINT,
    });

    const chatManager = new ChatManager({
      instanceLocator: CHATKIT_INSTANCE_LOCATOR,
      userId: CHATKIT_USER_NAME,
      tokenProvider: tokenProvider,
    });

    chatManager
      .connect()
      .then(currentUser => {
        this.currentUser = currentUser;
        this.currentUser.subscribeToRoom({
          roomId: CHATKIT_ROOM_ID,
          hooks: {
            onMessage: this.onReceive,
          },
        });
      })
      .catch(err => console.warn(err));
  }

  onReceive = data => {
    const { id, senderId, text, createdAt } = data;
    const incomingMessage = {
      _id: id,
      text: text,
      createdAt: new Date(),
      user: {
        _id: senderId,
        name: senderId,
        avatar:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmXGGuS_PrRhQt73sGzdZvnkQrPXvtA-9cjcPxJLhLo8rW-sVA',
      },
    };
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, incomingMessage),
    }));
  };

  onSend = (messages = []) => {
    messages.forEach(message => {
      this.currentUser
        .sendMessage({
          text: message.text,
          roomId: CHATKIT_ROOM_ID,
        })
        .then(() => {})
        .catch(err => console.warn(err));
    });
  };

  getColor(username) {
    let sumChars = 0;
    for (let i = 0; i < username.length; i++) {
      sumChars += username.charCodeAt(i);
    }

    const colors = [
      '#e67e22', // carrot
      // '#2ecc71', // emerald
      // '#3498db', // peter river
      // '#8e44ad', // wisteria
      // '#e74c3c', // alizarin
      // '#1abc9c', // turquoise
      // '#2c3e50', // midnight blue
    ];
    return colors[sumChars % colors.length];
  }

  renderBubble = props => {
    let username = props.currentMessage.user.name;
    let color = this.getColor(username);

    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: 'white',
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: color,
          },
        }}
      />
    );
  };

  render() {
    return (
      <GiftedChat
        placeholder="Enter your message :)"
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: CHATKIT_USER_NAME,
        }}
        isAnimated={true}
        onPressAvatar={() => console.warn('OnPressAvatar')}
        scrollToBottom={true}
        scrollToBottomOffset={0}
        renderBubble={this.renderBubble}
      />
    );
  }
}
