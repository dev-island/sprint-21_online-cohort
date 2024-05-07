import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Callback from "./pages/Callback";
import AuthRoute from "./components/AuthRoute";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./components/Loading";
import useCurrentUser from "./hooks/useCurrentUser";
import useSocket from "./hooks/useSocket";
import useMessages from "./hooks/useMessages";
import useNotifications from "./hooks/useNotifications";
import { useEffect } from "react";

function App() {
  const { addMessage } = useMessages();
  const { addNotification } = useNotifications();
  const { currentUser } = useCurrentUser();
  const { isLoading: isLoadingAuth } = useAuth0();
  const { sendMessage } = useSocket({ addMessage, addNotification });

  useEffect(() => {
    if (!currentUser) return;
    console.log("Current user: ", currentUser);
    sendMessage(JSON.stringify({ userId: currentUser._id }));
  }, [currentUser]);

  return (
    <Layout>
      {isLoadingAuth ? (
        <Loading />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/profile/:sub"
            element={
              <AuthRoute>
                <Profile />
              </AuthRoute>
            }
          />
          <Route
            path="/callback"
            element={
              <AuthRoute>
                <Callback />
              </AuthRoute>
            }
          />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      )}
    </Layout>
  );
}

export default App;
