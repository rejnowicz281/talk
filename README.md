# Talk

A simple chat application built with React and an Express API.

This is a recreation of my other [app](https://github.com/rejnowicz281/react-chat-rails) also built with React but with a Ruby On Rails API. In this one I used NodeJS and Express for the API.

Link to the API [here](https://github.com/rejnowicz281/talk-api)

Assignment for The Odin Project - [NodeJS Messaging App](https://www.theodinproject.com/lessons/nodejs-messaging-app)

## Features

-   User authentication
-   User can create and join chat rooms
-   User can chat with other users in the same room
-   User can see who is online
-   User can see when other users join or leave the room

## Known issues

-   Sometimes the socket fails to connect or is seemingly connected but the requests don't go through. This can cause the messages to not be sent or received, or user not being added to the online list. This is probably because of the free Fly.io hosting tier I'm using for the API. Try refreshing the page if this happens.
