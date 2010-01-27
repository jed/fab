( fab )
  ( "/hello", function() {
    return [
      200,
      { "Content-Length": 6, "Content-Type": "text/plain" },
      "hello!"
    ];
  })
( fab )