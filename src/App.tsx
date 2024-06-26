import React from "react";

import AppRouter from "./components/routing/routers/AppRouter";

//Import NextUIProvider component
import {NextUIProvider} from "@nextui-org/react";
import Landing from "./components/views/Landing";

const App = () => {
  return (
    <NextUIProvider> {/* Wrap everything with NextUIProvider */}
      <div>

        {/*<Header height="100" />*/}
        <AppRouter />
        {/*<Login />*/}

      </div>
    </NextUIProvider>
  );
};

export default App;
