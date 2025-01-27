public with sharing class FetchRelevantRecords {
  @AuraEnabled(cacheable=true)
  public static List<Doctor__c> getFilteredDoctors(String city) {
      // Query accounts filtered by location and name
      // String locationFilter = '%' + location + '%';
      // String nameFilter = '%' + name + '%';
      
      List<Doctor__c> records = [SELECT Id, Name, Description__c, PostalCode__c, State__c, Street__c, Country__c, City__c
      FROM Doctor__c
      WHERE City__c = :city
      ];
      System.debug(records);
      return records;    
  }
}