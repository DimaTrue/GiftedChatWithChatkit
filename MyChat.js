import React from 'react';
import { Alert } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';

const CHATKIT_TOKEN_PROVIDER_ENDPOINT = 'PUSHER_TOKEN_URL';
const CHATKIT_INSTANCE_LOCATOR = 'PUSHER_CHATKIT_INSTANCE_LOCATOR';
const CHATKIT_ROOM_ID = 'ROOM_ID';
const CHATKIT_USER_NAME = 'pusher-test-user';

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
            onMessage: message => alert(message.text),
          },
        });
      })
      .catch(err => console.warn(err));;
  }

  render() {
    return <GiftedChat messages={this.state.messages} />;
  }
}
