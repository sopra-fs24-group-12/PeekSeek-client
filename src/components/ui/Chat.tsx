import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";

const Chat: React.FC = () => {
  return (
<<<<<<< HEAD
    <Card className="h-full mx-auto max-w-md"> {/* Adjusted for a typical chat interface size */}
      <CardHeader className="justify-center">
        <h3 className="text-xl font-bold">Chat</h3>
      </CardHeader>
      <CardBody className="overflow-y-auto">
        {/* Placeholder content - adjust as needed for your chat UI */}
        <div className="p-4">
          <p>This is a placeholder for the chat component. Real chat messages will appear here once the feature is implemented.</p>
=======
    <Card className="h-full mx-auto max-w-md overflow-hidden" style={{ maxHeight: '610px' }}>
      <CardHeader className="justify-center">
        <h3 className="text-xl font-bold">Chat</h3>
      </CardHeader>
      <CardBody
        className="overflow-y-auto"
        style={{ maxHeight: '500px' }} // Sets a specific height for the chat body
      >
        {/* Placeholder content - adjust as needed for your chat UI */}
        <div className="p-4">
          <p>This is a placeholder for the chat component. Real chat messages will appear here once the feature is implemented.</p>
          {/* Example for more placeholder content to illustrate scrolling */}
          {Array.from({ length:20 }, (_, index) => (
            <p key={index}>Message {index + 1}</p>
          ))}
>>>>>>> ebdeb8fda43ed305682c4617c11a3ec0c2ffe1b7
        </div>
      </CardBody>
    </Card>
  );
};

<<<<<<< HEAD
export default Chat;
=======
export default Chat;
>>>>>>> ebdeb8fda43ed305682c4617c11a3ec0c2ffe1b7
