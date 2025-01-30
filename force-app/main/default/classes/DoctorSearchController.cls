public with sharing class DoctorSearchController {
    @AuraEnabled(cacheable=true)
    public static List<Doctor__c> getNearbyDoctors(Double radius, Double userLat, Double userLong) {
        // Ensure the Doctor__c object has a Geolocation field (e.g., Location__c)
        return [SELECT Id, Name, City__c, State__c, PostalCode__c, Country__c, Latitude__c, Longitude__c
                FROM Doctor__c
                WHERE DISTANCE(Location__c, GEOLOCATION(:userLat, :userLong), 'km') < :radius];
    }
}
