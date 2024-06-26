import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import MessagesProvider from "./context/MessagesContext.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import UserProvider from "./context/UserContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-6lssfc5bmy8gbdxj.us.auth0.com"
      clientId="MgV7TUQxUjLC7mnzZE2wwF3sblYnuoJO"
      authorizationParams={{
        redirect_uri: `${window.location.origin}/callback`,
        audience: "my-express-app",
      }}
    >
      <UserProvider>
        <MessagesProvider>
          <ChakraProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ChakraProvider>
        </MessagesProvider>
      </UserProvider>
    </Auth0Provider>
  </React.StrictMode>
);
