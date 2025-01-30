public with sharing class GeolocationServiceController {
    private static final String GOOGLE_API_KEY = 'AIzaSyA5-VqlcpZqM7H4svR4cVO9xf0LqdJSRXs';

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getCoordinates(String postalCode) {
        String url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + EncodingUtil.urlEncode(postalCode, 'UTF-8') + '&key=' + GOOGLE_API_KEY;

        HttpRequest req = new HttpRequest();
        req.setEndpoint(url);
        req.setMethod('GET');

        Http http = new Http();
        HTTPResponse res = http.send(req);
        System.debug(req);

        System.debug(res);
        if (res.getStatusCode() == 200) {
            Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            List<Object> results = (List<Object>) responseMap.get('results');
			
            //System.debug('this is result' + results);
            if (!results.isEmpty()) {
                Map<String, Object> location = (Map<String, Object>) ((Map<String, Object>) results[0]).get('geometry');
                Map<String, Object> latLng = (Map<String, Object>) location.get('location');
                return latLng; // Returns { "lat": xx.xxxx, "lng": yy.yyyy }
            }
        }
        return null;
    }
}