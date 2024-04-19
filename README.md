# Sprint 21 - Message app

### Announcements
1. No Class on Thursday
2. Phase 3 reviews next week -> Christian can we reschedule
3. Last sprint is next week
   1. Main focus - Continuous deployment

### Tonight's class
1. Questions from last class
2. Review updates made before tonights class
3. Review opening a PR, merging to main and updating my local branch
4. Web sockets -> Discuss "homework"
   1. What are they?
   2. How are they different from HTTP, Long Polling, Short Polling
   3. How would we use them in our application?
5. Implement websockets for messages

### Project
Implement notifications

#### Objectives
1. A user can see a list of notifications (Backend only)
   1. add an endpoint to get all notifications: /notifications
   2. Add an endpoint to get a list of notifications based on user._id (note, we'll be using the user SUB as param, not _id)
2. A user gets notified if someone follows them
   1. identify target user
   2. Create a new notification in the DB
   3. Broadcast an event to the connected client that matches the target user
      1. Add logic to broadcast to determine if the client we want to send a message to is the target user
3. A user is notified if someone "likes" their message
4. BONUS: A user is notified when one of the people they are following posts a message
5. BONUS: only authenticated users can see events emitted from the server
6. BONUS: Fix dupe message when creating a new message (I.e. broadcast shouldn't go to user who created the new message)

#### Instructions
1. Clone the repo
2. Change branches to ANDREW_notifications
3. Create a new branch using the following example to name it:
   1. YOUR-NAME_notifications
4. Create a plan for how you will implement the features, focus on "small pizzas"
5. Make frequent commits
6. Push to the remote branch & open a PR, diffing off of ANDREW_notifications.

