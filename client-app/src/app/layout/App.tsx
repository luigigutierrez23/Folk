import React, { useEffect } from "react";
import { Container } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { Route, Switch, useLocation } from "react-router-dom";
import { useStore } from "../stores/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import NavBar from "./NavBar";
import PostDashboard from "../../features/posts/dashboard/PostDashboard";
import HomePage from "../../features/home/HomePage";
import PostForm from "../../features/posts/form/PostForm";
import PostDetails from "../../features/posts/details/PostDetails";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import TestErrors from "../../features/errors/TestError";
import ProfilePage from "../../features/profiles/ProfilePage";
import PrivateRoute from "./PrivateRoute";

function App() {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded)
    return <LoadingComponent inverted content="Loading app..." />;

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar />
      <ModalContainer />
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <PrivateRoute exact path="/posts" component={PostDashboard} />
                <PrivateRoute path="/posts/:id" component={PostDetails} />
                <PrivateRoute
                  key={location.key}
                  path={["/create-post", "/manage/:id"]}
                  component={PostForm}
                />
                <PrivateRoute
                  path={"/profiles/:username"}
                  component={ProfilePage}
                />
                <Route path="/errors" component={TestErrors} />
                <Route path="/server-error" component={ServerError} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
