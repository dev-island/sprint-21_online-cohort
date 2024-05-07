const ROOT = "http://localhost:3000/users";
import { User } from "@auth0/auth0-react";

export const createOrUpdate = async (user: User) => {
  const res = await fetch(ROOT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return res.json();
};

export const getUser = async (sub: string, token: string) => {
  const res = await fetch(`${ROOT}/${sub}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const updateUser = async (sub: string, user: User, token: string) => {
  const res = await fetch(`${ROOT}/${sub}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });
  return res.json();
};

export const followUser = async (
  sub: string,
  currentUserId: string,
  token: string
) => {
  const res = await fetch(`${ROOT}/${sub}/follow`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentUserId }),
  });
  return res.json();
};

export const unfollowUser = async (
  sub: string,
  currentUserId: string,
  token: string
) => {
  const res = await fetch(`${ROOT}/${sub}/unfollow`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentUserId }),
  });
  return res.json();
};

type GetUserNotificationsRequest = {
  sub: string;
  token: string;
};
export const getUserNotifications = async ({
  sub,
  token,
}: GetUserNotificationsRequest) => {
  const res = await fetch(`${ROOT}/${sub}/notifications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};
