export type IUser = {
  _id: string;
  username: string;
  sub: string;
  email: string;
  displayName: string;
  joinedDate: string;
  profileImage: string;
  bio: string;
  headerImage: string;
  __v: number;
  followers: IUser[];
  following: IUser[];
};

export type IMessage = {
  _id: string;
  __v: number;
  body: string;
  createdDate: string;
  likes: IUser[];
  author: IUser;
  authorId: string;
  likeIds: string[];
};

export type Notification = {
  _id: string;
  __v: number;
  action: "LIKE" | "FOLLOW" | "NEW_MESSAGE";
  createdDate: string;
  recipient: IUser;
  actor: IUser;
  isRead: boolean;
};
