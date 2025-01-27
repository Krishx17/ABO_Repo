public with sharing class PhysicianSearchController {
  @AuraEnabled
  public static List<Physician__c> searchPhysicians(Map<String, String> searchCriteria) {
      String firstName = searchCriteria.get('firstName');
      String lastName = searchCriteria.get('lastName');
      String postalCode = searchCriteria.get('postalCode');
      String city = searchCriteria.get('city');
      String state = searchCriteria.get('state');

      String query = 'SELECT Id, Name, City__c, State__c FROM Physician__c WHERE ';
      List<String> conditions = new List<String>();

      if (String.isNotBlank(firstName)) {
          conditions.add('First_Name__c LIKE \'%' + String.escapeSingleQuotes(firstName) + '%\'');
      }
      if (String.isNotBlank(lastName)) {
          conditions.add('Last_Name__c LIKE \'%' + String.escapeSingleQuotes(lastName) + '%\'');
      }
      if (String.isNotBlank(postalCode)) {
          conditions.add('Postal_Code__c = ' + String.escapeSingleQuotes(postalCode));
      }
      if (String.isNotBlank(city)) {
          conditions.add('City__c LIKE \'%' + String.escapeSingleQuotes(city) + '%\'');
      }
      if (String.isNotBlank(state)) {
          conditions.add('State__c = \'' + String.escapeSingleQuotes(state) + '\'');
      }

      query += String.join(conditions, ' AND ');

      return Database.query(query);
  }
}
