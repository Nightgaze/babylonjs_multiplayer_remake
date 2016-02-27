# Remake

This project is a platform for a multiplayer browser game based on Babylon.js.
While my other repositories were just 'playtests' in order to learn new tools and concepts, this is striving to be done in the best way, taking into account modularity. 
>When it comes to writing code, the number one most important skill is how to keep a tangle of features from collapsing under the weight of its own complexity.

## Features in development:
##### 3D object data stored in a CouchDB database - 30%

##### Real time multiplayer interaction - 0%

##### Browser editor - 30%


## Tech
Open source projects used in the developing of this:
* [Node.js] - the core!
* [Express] - Node.js app framework 
* [Socket.io] - Websockets component in node.js for live multiplayer
* [CouchDB] - JSON document oriented database for 3D object positions, updates, etc.
* [babylon.js] - Javascript WebGL engine

## To run this:
You require node.js installed and also couchDB installed with a database named 'props' and a temporary view named "get props" with the code: 

```sh
function(doc) {
  emit(doc._id, doc);
}
```
write this in Terminal:
```sh
$ node app.js
```
and finally:
http://localhost/game


## Documentation I used:
[Fast Paced Multiplayer by Gabriel Gambetta]

## Version
0.0.0





[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [CouchDB]: <couchdb.apache.org>
   [babylon.js]: <http://www.babylonjs.com>
   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [Express]: <http://expressjs.com>
   [socket.io]: <https://socket.io>
   [Fast Paced Multiplayer by Gabriel Gambetta]: <http://www.gabrielgambetta.com/fast_paced_multiplayer.html>




