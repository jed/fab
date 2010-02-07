( fab )
  ( "/hello1", {
    status: 200,
    headers: { "Content-Length": 6 },
    body: "hello!"
  })

  ( "/hello2", function() {
    return {
      status: 200,
      headers: { "Content-Length": 6 },
      body: "hello!"
    };
  })

  ( "/hello3", function() {
    respond({
      status: 200,
      headers: { "Content-Length": 6 },
      body: "hello!"
    }, null );
  })

  ( "/hello4", function() {
    respond( { status: 200 } );
    respond( { headers: { "Content-Length": 6 } } );
    respond( { body: "hello!" } );
    respond( null );
  })
( fab )