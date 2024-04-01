import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";

const Chat: React.FC = () => {
  return (
    <Card className="h-full mx-auto max-w-md"> {/* Adjusted for a typical chat interface size */}
      <CardHeader className="justify-center">
        <h3 className="text-xl font-bold">Chat</h3>
      </CardHeader>
      <CardBody className="overflow-y-auto">
        {/* Placeholder content - adjust as needed for your chat UI */}
        <div className="p-4">
          <p>This is a placeholder for the chat component. Real chat messages will appear here once the feature is implemented.</p>
        </div>
      </CardBody>
    </Card>
  );
};

export default Chat;