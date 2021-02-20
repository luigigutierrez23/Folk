import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { Image, List, Popup } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";
import ProfileCard from "../../profiles/ProfileCard";

interface Props {
  attendees: Profile[];
}

export default observer(function PostListItemAttendee({ attendees }: Props) {
  return (
    <List horizontal>
      {attendees.map((a) => (
        <Popup
          hoverable
          key={a.username}
          trigger={
            <List.Item
              key={a.username}
              as={Link}
              to={`/profiles/${a.username}`}
            >
              <Image size="mini" circular src={a.image || "/assets/user.png"} />
            </List.Item>
          }
        >
          <Popup.Content>
            <ProfileCard profile={a} />
          </Popup.Content>
        </Popup>
      ))}
    </List>
  );
});
