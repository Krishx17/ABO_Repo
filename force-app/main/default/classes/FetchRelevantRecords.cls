public with sharing class FetchRelevantRecords {
    @AuraEnabled(cacheable=true)
    public static List<Doctor__c> getFilteredDoctors(String firstName, String lastName, String city, String state, String gender) {
        // Start with the base query
        String query = 'SELECT Id, Name, Description__c, PostalCode__c, State__c, Street__c, Country__c, City__c, Gender__c FROM Doctor__c';
        
        // Initialize a list to hold query conditions
        List<String> conditions = new List<String>();
        
        // Add conditions dynamically based on input
        if (String.isNotBlank(firstName)) {
            conditions.add('Name LIKE \'%' + String.escapeSingleQuotes(firstName) + '%\'');
        }
        if (String.isNotBlank(lastName)) {
            conditions.add('Name LIKE \'%' + String.escapeSingleQuotes(lastName) + '%\'');
        }
        if (String.isNotBlank(city)) {
            conditions.add('City__c LIKE \'%' + String.escapeSingleQuotes(city) + '%\'');
        }
        if (String.isNotBlank(state)) {
            conditions.add('State__c LIKE \'%' + String.escapeSingleQuotes(state) + '%\'');
        }
        if (String.isNotBlank(gender)) {
            conditions.add('Gender__c LIKE \'%' + String.escapeSingleQuotes(gender) + '%\'');
        }
        

        // Append conditions to the query if any exist
        if (!conditions.isEmpty()) {
            query += ' WHERE ' + String.join(conditions, ' OR ');
        }

        // Execute and return the query
        List<Doctor__c> records = Database.query(query);
        System.debug(records);
        return records;
    }
}
