import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Callback from "./pages/Callback";
import AuthRoute from "./components/AuthRoute";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./components/Loading";
import useSocket from "./hooks/useSocket";
import useNotifications from "./hooks/useNotifications";

function App() {
  useSocket();
  const { isLoading: isLoadingAuth } = useAuth0();
  const { isLoading: isLoadingNotifications } = useNotifications();
  const isLoading = isLoadingAuth || isLoadingNotifications;
  console.log("loading?", { isLoadingAuth, isLoadingNotifications });
  return (
    <Layout>
      {isLoading ? (
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
