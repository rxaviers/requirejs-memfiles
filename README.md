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

requirejs.setFiles( files );
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

}, function( error ) {
  // handle error
  ...

});
```

## API

`requirejs.setFiles( files )`

- files Object containing (path, data) key-value pairs, e.g.:

    {
       <path-of-file-1>: <data-of-file-1>,
       <path-of-file-2>: <data-of-file-2>,
       ...
    }

## Test

    npm test

## License

MIT © [Rafael Xavier de Souza](http://rafael.xavier.blog.br)
