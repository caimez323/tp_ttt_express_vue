# Tic-tac-toe workshop

This this a base repository of my tic tac toe workshop.
The goal of this workshop is to learn about modern web concepts.
You will learn about the following concepts:
* Rest APIs
* Client-side rendering

And about the following technologies:
* [HTML](https://developer.mozilla.org/en-US/docs/Glossary/html)
* [CSS](https://developer.mozilla.org/en-US/docs/Glossary/css)
* [Vue.js](https://github.com/vuejs/vue) (for client-side rendering)
* [Node.js](https://nodejs.org/) with [Express.js](https://github.com/expressjs/express) (for server-side api)

## Architecture rundown
### Client ("front")
The vue project in `/src` is a standalone client for the game, compiled as a `index.html` and other assets files in `/dist`.

### Server ("back")
A server is running the game's logic. This is done by running node.js on the `./index.js` file.

Part of this server is responding to requests on the root `/` by sending back the front (`/dist/index.html` and other assets from `/dist`).
The rest is used to communicate with the client.

## Commands
### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
