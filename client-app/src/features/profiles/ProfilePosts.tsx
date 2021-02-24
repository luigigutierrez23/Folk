import React, { SyntheticEvent, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Tab, Grid, Header, Card, Image, TabProps } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { UserPost } from "../../app/models/profile";
import { format } from "date-fns";
import { useStore } from "../../app/stores/store";

const panes = [
  { menuItem: "Future Events", pane: { key: "future" } },
  { menuItem: "Past Events", pane: { key: "past" } },
  { menuItem: "Hosting", pane: { key: "hosting" } },
];

export default observer(function ProfileActivities() {
  const {
    profileStore: { loadUserPosts, profile, loadingPosts, userPosts },
  } = useStore();

  useEffect(() => {
    loadUserPosts(profile!.username);
  }, [loadUserPosts, profile]);

  const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
    loadUserPosts(
      profile!.username,
      panes[data.activeIndex as number].pane.key
    );
  };

  return (
    <Tab.Pane loading={loadingPosts}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="calendar" content={"Posts"} />
        </Grid.Column>
        <Grid.Column width={16}>
          <Tab
            panes={panes}
            menu={{ secondary: true, pointing: true }}
            onTabChange={(e, data) => handleTabChange(e, data)}
          />
          <br />
          <Card.Group itemsPerRow={4}>
            {userPosts.map((post: UserPost) => (
              <Card as={Link} to={`/activities/${post.id}`} key={post.id}>
                <Image
                  src={`/assets/categoryImages/${post.category}.jpg`}
                  style={{ minHeight: 100, objectFit: "cover" }}
                />
                <Card.Content>
                  <Card.Header textAlign="center">{post.title}</Card.Header>
                  <Card.Meta textAlign="center">
                    <div>{format(new Date(post.date), "do LLL")}</div>
                    <div>{format(new Date(post.date), "h:mm a")}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
