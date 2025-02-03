public with sharing class ProximityMapController {
    @AuraEnabled(cacheable=true)
    public static List<Doctor__c> getNearbyDoctors(Double radius, Double userLat, Double userLong) {
        if (radius == null || userLat == null || userLong == null) {
            throw new AuraHandledException('Invalid parameters: Radius, Latitude, and Longitude are required.');
        }

        // Ensure Location__c is a Geolocation field in Doctor__c
        return [SELECT Id, Name, City__c, State__c, PostalCode__c, Country__c, Location__Latitude__s, Location__Longitude__s
                FROM Doctor__c
                WHERE DISTANCE(Location__c, GEOLOCATION(:userLat, :userLong), 'km') <= :radius];
    }
}
