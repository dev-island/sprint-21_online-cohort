import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import * as api from "../../api/users";
import useCurrentUser from "../../hooks/useCurrentUser";

const Callback = () => {
  console.log("Potato");
  const { isAuthenticated, isLoading, user, getAccessTokenSilently } =
    useAuth0();
  const { setCurrentUser, setToken } = useCurrentUser();
  const navigate = useNavigate();
  // Once we have the user, send a request to the server to create a new user in our database
  //  once the user is stored in our db we can redirect the user to the profile page
  // This is kind of how it will look

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCreateOrUpdate = async () => {
    debugger;
    if (isLoading || !isAuthenticated || !user) return;
    const { data } = await api.createOrUpdate(user);
    if (!data) {
      alert("Failed to create user");
      return navigate("/");
    }

    const token = await getAccessTokenSilently();
    if (!token) {
      alert("Failed to get token");
      return navigate("/");
    }
    setCurrentUser(data);
    setToken(token);
    navigate(`/profile/${data.sub}`);
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      handleCreateOrUpdate();
    }
  }, [isLoading, isAuthenticated, user, handleCreateOrUpdate]);

  return <Spinner />;
};

export default Callback;
