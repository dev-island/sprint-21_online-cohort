import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Callback from "./pages/Callback";
import AuthRoute from "./components/AuthRoute";
import { useAuth0 } from "@auth0/auth0-react";
import { Center, Container, Spinner } from "@chakra-ui/react";

function App() {
  const { isLoading } = useAuth0();

  return (
    <Layout>
      {isLoading ? (
        <Container h="100%">
          <Center mt="100px">
            <Spinner />
          </Center>
        </Container>
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
