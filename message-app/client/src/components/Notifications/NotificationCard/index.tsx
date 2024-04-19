import { FC } from "react";
import { Text, Image, Icon, Flex, Button, Link } from "@chakra-ui/react";
import { FiCheckCircle } from "react-icons/fi";

import { Notification } from "../../../types";

export type Props = {
  notification: Notification;
  markNotificationRead: (id: string) => void;
};

const NotificationCard: FC<Props> = ({
  notification,
  markNotificationRead,
}) => {
  const NOTIFICATION_TYPE_TO_MESSAGE = {
    LIKE: "liked your message",
    FOLLOW: "followed you",
    NEW_MESSAGE: "posted a new message",
  };

  const message = NOTIFICATION_TYPE_TO_MESSAGE[notification.action];

  return (
    <Flex gap={4}>
      <Flex gap={2} align="center">
        <Image
          src={notification.actor.profileImage}
          w={8}
          h={8}
          borderRadius="full"
        />
        <Text>
          <Link href={`/profile/${notification.actor.sub}`}>
            {notification.actor.displayName || notification.actor.username}
          </Link>{" "}
          {message}
        </Text>
      </Flex>
      <Button
        variant="link"
        onClick={() => markNotificationRead(notification._id)}
      >
        <Icon as={FiCheckCircle} color="green.500" />
      </Button>
    </Flex>
  );
};

export default NotificationCard;
