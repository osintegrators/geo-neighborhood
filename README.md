# Geo-Neighborhoods #

A live version of this app can be found at: http://geo-neighborhood.cfapps.io

*NOTE: The neighborhoods of Streeterville and Ohare don't exist in this app currently.
The neighborhood data published by the City of Chicago defines these two neighborhoods as
MultiPolygons, an unsupported GeoJSON type in MongoDB.  This could easily be worked around,
but I haven't spent the time to fix up the data yet.*

### The Data ###

City of Chicago neighborhood boundaries were found here: [http://www.cityofchicago.org/city/en/depts/doit/dataset/boundaries_-_neighborhoods.html](http://www.cityofchicago.org/city/en/depts/doit/dataset/boundaries_-_neighborhoods.html)


I converted the data to GeoJSON format using `ogr2ogr`, a command line tool available
with [GDAL](http://www.gdal.org/index.html):

    ogr2ogr -f "GeoJSON" -t_srs crs:84 neighborhoods.json Neighborhoods_2012b.shp

The `-t_srs crs:84` specifies a projection to use.  If you leave this part off, you won't be dealing with degrees in your output document.

The resulting file is a single GeoJSON object of the `FeatureCollection` type, which looks like:

    {
      "type": "FeatureCollection",
      "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          
      "features": [ {a neighborhood as a GeoJSON feature},...],
    }

I saved just the `features` array as a separate file, then imported it into MongoDB using `mongoimport`

    mongoimport --db Chicago --collection neighborhoods --jsonArray neighborhoods-formatted.json

While it's not required for `$geoIntersects`, adding a `2dsphere` index will boost query performance.  Open up the mongo shell and run the following command:

    db.neighborhoods.ensureIndex({geometry: "2dshere"});
