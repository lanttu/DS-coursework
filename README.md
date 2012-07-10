# Distributed systems - Course work

This is course work for course _521266S Distributed Systems_ spring 2012

1. Install node
2. Install npm
3. npm install git://github.com/lanttu/DS-coursework.git

### Structure

    <--->    Event
    <- - ->  WebScoket

#### Host
    Game <---> Player <---> BrowserEndpoint <- - -> Browser

#### Client
    Game <---> RemotePlayer <- - -> PlayerClient <---> BrowserEndpoint <- - -> Browser


### Extra scores

1. Client UIs do not use polling to implement notifys (reverse AJAX,  HTML5, etc.) 
    * Using socket.io
2. Communication between peers is encrypted
    * Using https
3. Fault tolerance: restarting the browser or web server is handled gracefully, e.g. state is recovered or other peers notify users accordingly (+1)
    * Restartarting browser or client node is handled gracefully
4. No hard-coded peer list for discovery or messaging
    * Server address can be manually set
5. Provide a _fully_ functional installer (e.g. RPM, VM, batch file...)
