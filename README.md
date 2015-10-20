# BSVE-GeoJS test application

This repo contains a demo app that minimally integrates a GeoJS
map into the BSVE.

## Local testing

There is a development hook in the application to simulate running inside the BSVE.  This
will call the map's display method on a pregenerated query.

```
npm install
npm start
```

Then open your browser to [http://localhost:8080/](http://localhost:8080/).

## Deploying to the BSVE

You need to have the BSVE CLI SDK installed according to the [directions](http://developer.bsvecosystem.net/wp/setting-up-cli/).
Once the `bsve` application is on you path, initialize your configuration with `bsve init <username>`.  Once this is done
you can deploy the application to the test environment.

```
npm install
npm run deploy
```

After a few minutes the application will be available at [http://test.bsvecosystem.net/](http://test.bsvecosystem.net/).
You will find it by clicking the `Apps` button and searching for `geojs`.  Type a search term in the window should
open a map with the points returned by the query displayed.
