import React, { useState, useEffect } from "react";
import "./App.css";
import data from "./data.json";

export enum MessageItemType {
  REPLY = "reply",
  USER = "user",
}

export interface MessageItem {
  id: string;
  type: MessageItemType;
  text?: string | null;
  responses: string[];
}

interface MessageProps {
  message: MessageItem;
}

const UserMessage = ({ message }: MessageProps) => (
  <div key={message.id} className="bg-white rounded-md mt-4">
    <p className="text-dark-body px-2 py-1 text-sm m-0">{message.text}</p>
  </div>
);

const ReplyMessage = ({ message }: MessageProps) => (
  <div key={message.id} className="bg-secondary rounded-md mt-4">
    <p className="text-dark-body px-2 py-1 text-sm m-0">{message.text}</p>
  </div>
);

function App() {
  const firstMessage = data.find((message) => message.root === true) as unknown as MessageItem | null;
  const [currentMessage, setCurrentMessage] = useState<MessageItem | null>(firstMessage ?? null);
  const [messageHistory, setMessageHistory] = useState<MessageItem[]>([]);

  useEffect(() => {
    if (firstMessage) {
      setMessageHistory([firstMessage]);
    }
  }, [firstMessage]);

  let showButtons = false;

  if (currentMessage?.type === MessageItemType.USER) {
    showButtons = true;
  }

  const showNextMessage = (currentMessage: MessageItem) => {
    if (currentMessage.responses.length > 0) {
      const responseId = currentMessage.responses[0];
      const nextMessage = data.find((message) => message.id === responseId && message.type === MessageItemType.REPLY);
      if (nextMessage) {
        setCurrentMessage(nextMessage as unknown as MessageItem);
        setMessageHistory([...messageHistory, nextMessage as unknown as MessageItem]);
      }
    }
  };

  return (
    <>
      <div className="container sm mx-auto">
        <div className="flex flex-col h-screen">
          <header className="h-16 bg-chat-header p-4">
            <h2 className="text-dark-body text-lg">Jason</h2>
          </header>
          <main className="flex-grow overflow-auto flex-col-reverse bg-chat-body">
            <div className="px-4 py-4">
              {currentMessage && (
                <>
                  {currentMessage.type === MessageItemType.USER && (
                    <UserMessage message={currentMessage} />
                  )}
                  {currentMessage.type === MessageItemType.REPLY && (
                    <ReplyMessage message={currentMessage} />
                  )}
                </>
              )}
            </div>
          </main>
          <footer className="h-40 bg-chat-header">
            <div className="px-2 py-4 flex flex-col gap-2">
              <div>
                {showButtons && (
                  <button
                    className="bg-white text-dark-body text-sm px-4 py-2 border-light-body border-2 border-solid rounded-xl"
                    onClick={() => {
                      if (currentMessage) {
                        showNextMessage(currentMessage);
                      }
                    }}
                  >
                    Response
                  </button>
                )}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;