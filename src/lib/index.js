class Destaxa {
  constructor(server='ws://localhost', port='60906') {
    this.server = server;
    this.port = port;
  }

  connect = () => {
    this.connection = new WebSocket(server + port);

    this.connection.onopen = function(e) {
      alert("[open] Connection established");
      alert("Sending to server");
      this.connection.send("My name is John");
    };
    
    this.connection.onmessage = function(event) {
      console.log(`[message] Data received from server: ${event.data}`);
    };
    
    this.connection.onclose = function(event) {
      if (event.wasClean) {
        alconsole.logert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('[close] Connection died');
      }
    };
    
    this.connection.onerror = function(error) {
      console.log(`[error] ${error.message}`);
    };

  };

  myMethod = () => {
    console.log("Library method fired");
  };
}

export default Destaxa;