public class AccordionMetadataService {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> fetchAccordionData() {
        // Query all metadata records
        List<Accordion_Metadata__mdt> metadataList = [
            SELECT DeveloperName,Key__c , Parent_Key__c, Label, Description__c, Level__c, Sort_Order__c, Page_Name__c
            FROM Accordion_Metadata__mdt 
            WHERE IsActive__c = TRUE 
            ORDER BY Sort_Order__c ASC
        ];

        // Organize data into a hierarchy
        Map<String, List<Map<String, Object>>> parentMap = new Map<String, List<Map<String, Object>>>();
        for (Accordion_Metadata__mdt metadata : metadataList) {
            String parentKey = metadata.Parent_Key__c;
            System.debug('parentKey::'+parentKey + ' '+ metadata.Sort_Order__c);
            if (!parentMap.containsKey(parentKey)) {
                parentMap.put(parentKey, new List<Map<String, Object>>());
            }
            parentMap.get(parentKey).add(new Map<String, Object>{
                'key' => metadata.Key__c,
                'label' => metadata.Label,
                'description' => metadata.Description__c,
				'pageName' => metadata.Page_Name__c
            });
        }
            system.debug('parentMap::'+parentMap);
        // Build hierarchy for the top level
        List<Map<String, Object>> topLevel = parentMap.get(null);
            system.debug('topLevel::'+topLevel);

        for (Map<String, Object> aboutItem : topLevel) {
            system.debug('aboutItem11::'+aboutItem);
            aboutItem.put('sections', parentMap.get((String)aboutItem.get('key')));
            system.debug('aboutItem22::'+aboutItem);
            List<Map<String, Object>> sections = (List<Map<String, Object>>)aboutItem.get('sections');
            for (Map<String, Object> sectionItem : sections) {
                sectionItem.put('subSections', parentMap.get((String)sectionItem.get('key')));
            }
        }

        return topLevel;
    }

}