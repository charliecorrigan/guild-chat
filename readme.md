# Guild Chat App

## Basic Chat Interface
To use the chat app, visit the [deployed app on Heroku](http://guild-chat.herokuapp.com/).
Because it is a free account, the dynamos can be slow to start, occasionally slowing initial load time.

1. To start, enter a userName (whatever name you'd like) into the login box. Hit `Enter` or click `Login`. Note: The userNames are case sensitive at the moment. This will create an account if one does not yet exist.
2. Either have a friend do the same on a different computer, or repeat this in an incognito window, with a different userName. You need two to chat.
3. The first user should see their userName in the `From` input. Enter the other userName in the `To` input.
4. Add a message and hit `Enter` or select `Send`
5. The message should appear on the other user's screen and in your own dialog area below the form

## Endpoints

No auth or additional headers currently required. The following endpoints are called by the client:

### /messages

`GET` `http://guild-chat.herokuapp.com/messages`
* Recent messages can be requested from all senders - with a limit of 100 messages (default if no params are provided) or all messages in last 30 days: 
    * http://guild-chat.herokuapp.com/messages?limitBy=date
    * http://guild-chat.herokuapp.com/messages?limitBy=qty
* Recent messages can be requested for a recipient from a specific sender - with a limit of 100 messages or all messages in last 30 days.
    * http://guild-chat.herokuapp.com/messages?recipient=guildEducation&sender=charlie&limitBy=date
    * http://guild-chat.herokuapp.com/messages?recipient=charlie&sender=guildEducation&limitBy=qty


`POST` `http://guild-chat.herokuapp.com/messages`
* Messages are= saved to the DB and emitted via socket.io in a post call to the `/messages` endpoint.
Sample message:
```
{
  content: "Hello, friend!",
  sender: "harrypotter",
  recipient: "hermioneGranger"
}
```
```
method: 'POST'
body: sampleMessage,
headers: {
  'Content-Type': 'application/json'
},
referrer: 'no-referrer'
```

### /messages
`POST` `http://guild-chat.herokuapp.com/login`
* Login associates a userName with a socketId so that messages can be directed to and from individuals, rather than to rooms or broadcast openly. This endpoint could be used in future iterations to handle secure sign on/authentication.

```
method: 'POST',
body: "{"socketId":"123abcxyz","userName":"severusSnape"}",
headers: {
  'Content-Type': 'application/json'
},
referrer: 'no-referrer'
```
## Local Setup
### Tools Etc
Guild Chat is a node/express app. The small client portion uses vanilla js to render forms and dialog areas. Chat functionality is provided by [socket.io](https://www.npmjs.com/package/socket.io).

To run a local instance of the app, clone this repo to a local directory.

### Database setup
Create a `.env` file at the root level of the app. Populate it with these variables:

```
DB_USER=guild
DB_PASSWORD=insertpassword
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=guild_chat
```

If you do not already have postgresql installed, install it:

```
brew install postgresql
brew services start postgresql
```
Login

```
psql postgres
```
Create a user and grant permissions.

```
CREATE ROLE guild WITH LOGIN PASSWORD 'insertpassword';
ALTER ROLE guild CREATEDB;
```
Log into your new account.

```
\q
psql -d postgres -U guild
```
Create the database and connect

```
CREATE DATABASE guild_chat;
\c guild_chat
```

Create the tables and a couple of sample users/messages by copy/pasting and running the SQL from `init.sql`

### Build and run
From your console, at the root level of the project, run `npm install` and then `nodemon index.js`
Visit http://localhost:3000/messages and see the message you saved to the database. Visit http://localhost:3000 to start chatting locally.

## Developer Notes
A few obvious TODOs:
1. Error handling
2. Testing
3. Separate query strings into another file
4. Create queryBuilder helper function to cleanup `#getMessages` in pgClient
5. UI imporovements
6. Add username case insensitivity
7. Remove socketid when logged out to signal possible "offline" messaging
8. Address postgresql/heroku certificate issue

