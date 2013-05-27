// http://docs.openlayers.org/library/introduction.html
// http://openlayers.org/dev/examples/google-v3.js

var map;

function init(mapElement, kmlElement, wktElement) {
    map = new OpenLayers.Map(mapElement, {
        projection: 'EPSG:3857',
        layers: [
            new OpenLayers.Layer.Google(
                'Google Streets', // the default
                { numZoomLevels: 20 }
            ),
            new OpenLayers.Layer.Vector('Kml data')
        ],
        center: new OpenLayers.LonLat(144.965, - 37.803)
            // Google.v3 uses web mercator as projection, so we have to
            // transform our coordinates
            .transform('EPSG:4326', 'EPSG:3857'),
        zoom: 10
    });


    kmlElement.on("blur", function() {
        wktElement.val(process($(this).val()));
    });
}

function convertKmlToFeatures(kml) {
    var kmlFormat = new OpenLayers.Format.KML();
    var features = kmlFormat.read(kml);
    for (var i = 0, l = features.length; i < l; i++) {
        features[i].geometry.transform('EPSG:4326', 'EPSG:3857');
    }
    return features;
}

function zoomToPolygon(features) {
    if (features == null || features == '') {
        return;
    }

    var bounds = new OpenLayers.Bounds();
    for (var x in features) {
        bounds.extend(features[x].geometry.getBounds());
    }

    map.zoomToExtent(bounds, false);
}

function process(kml) {

    if (kml == null || kml == '') {
        return '';
    }

    // Convert kml to features.
    var features = convertKmlToFeatures(kml);

    // Display features.
    map.layers[1].addFeatures(features);

    // Zoom to the features.
    zoomToPolygon(features);

    // Output the features as WKT.
    var options = {
        'internalProjection': new OpenLayers.Projection("EPSG:3857"),
        'externalProjection': new OpenLayers.Projection("EPSG:4326")
    };
    var wktFormat = new OpenLayers.Format.WKT(options);
    return wktFormat.write(features);
}