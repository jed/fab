fab.fs
------

A unary app that acts as a proxy to the filesystem. The remaining path of the current request is appended to the given base directory (or the current working directory otherwise) to fetch the file.

Currently, only `GET` requests are supported to return files. Eventually, `PUT`, `DELETE`, and will be allowed to enable the creation and deletion of files. Also, files are not currently streamed, but buffered and then returned.

**Arity**: 1

**Arguments**:

1. The base directory from which to obtain files.

**Examples**:

    ()
      ( "/static" )
        ( fab.fs( "/my/files" ) )
      ()
    ()
