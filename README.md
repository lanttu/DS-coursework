# Distributed systems - Course work

## Node

### States

1. Disconnected
    * Listening possible connections
    * -> State 2 if someone connects
    * -> State 3 if connecting to another disconnected node
2. Hosting - Waiting
    * Someone connected
    * Waiting for more players
    * -> State 4 when game starts
    * -> State 1 if everyone disconnects
3. Connected - Waiting
    * Connected to another node
    * -> State 5 when game starts
    * -> State 1 if disconnecting
4. Hosting - Playing
5. Connected - Playing


### Structure

<--->    Event
<- - ->  WebScoket

#### Host
Game <---> Player <---> BrowserEndpoint <- - -> Browser

#### Client
Game <---> RemotePlayer <- - -> PlayerClient <---> BrowserEndpoint <- - -> Browser

