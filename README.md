# Distributed systems - Course work

1. Install node
2. Install npm

### Structure

<--->    Event
<- - ->  WebScoket

#### Host
Game <---> Player <---> BrowserEndpoint <- - -> Browser

#### Client
Game <---> RemotePlayer <- - -> PlayerClient <---> BrowserEndpoint <- - -> Browser


### Extra scores

* Client UIs do not use polling to implement notifys (reverse AJAX,  HTML5, etc.) 
    * Using socket.io
* Communication between peers is encrypted
    * https
* Fault tolerance: restarting the browser or web server is handled gracefully, e.g. state is recovered or other peers notify users accordingly (+1)
    * Restartarting browser or client is handled gracefully
* No hard-coded peer list for discovery or messaging
    * Server address can be manually set
* Provide a _fully_ functional installer (e.g. RPM, VM, batch file...)
