( fab )
  ( "/hello", function() {
    return {
      status: 200,
      headers: {
        "Content-Length": 6,
        "Content-Type": "text/plain"
      },
      body: "hello!"
    };
  })
( fab )