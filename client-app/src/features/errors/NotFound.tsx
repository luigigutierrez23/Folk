import React from "react";
import { Segment, Button, Header, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="search" />
        Oops - we've looked everywhere and could not find this.
      </Header>
      <Segment.Inline>
        <Button as={Link} to="/posts" primary>
          Return to posts page
        </Button>
      </Segment.Inline>
    </Segment>
  );
}
