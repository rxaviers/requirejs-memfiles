## Why requirejs-memfiles?

`requirejs` is a great tool for building JS bundles. But, it doesn't process
already in-memory files.

`requirejs-memfiles` is `requirejs` with an additional static method
`requirejs.setFiles()` that allows for passing in-memory files. It's ideal for
applications that builds bundles on the fly.

## Usage

   npm install requirejs-memfiles

```javascript
var fs = require( "js" );
var requirejs = require( "requirejs-memfiles" );

var files = {
  "main.js": fs.readFileSync( "./main.js" ),
  ...
}

requirejs.setFiles( files, function( done ) {
  requirejs.optimize({
    appDir: ".",
    baseUrl: ".",
    dir: "dist",
    modules: [{
        name: "output",
        include: "main",
        create: true
    }]
  }, function() {
    var output = files[ "dist/output.js" ];
    ...
    done();

  }, function( error ) {
    // handle error
    ...
    done();

  });
});
```

## API

- **`requirejs.setFiles( files, callback )`**

**files** *Object* containing (path, data) key-value pairs, e.g.:

```
{
   <path-of-file-1>: <data-of-file-1>,
   <path-of-file-2>: <data-of-file-2>,
   ...
}
```

- **callback** *Function* called with one argument: a callback function that
must be called when use is complete.

## Test

    npm test

## License

MIT © [Rafael Xavier de Souza](http://rafael.xavier.blog.br)
