// * Controller class for Contact Datatable
public with sharing class ContactDatatableController {

    // * This method is used to return the list of contacts
    @AuraEnabled
    public static List<Contact> getContacts(Integer queryLimit, Integer queryOffset, Map<String, String> recordsFilter) {
        String query = 'SELECT Name, Account.Name, Phone, Email, LeadSource, MailingAddress FROM Contact';
        query = addFilter(query, recordsFilter);
        query += ' ORDER BY Name ASC LIMIT ' + queryLimit + ' OFFSET ' + queryOffset;
        return Database.query(query);
    }

    // * This method is used to return the number of contacts
    @AuraEnabled
    public static Integer getContactsCount(Map<String, String> recordsFilter) {
        String query = 'SELECT COUNT() FROM Contact';
        query = addFilter(query, recordsFilter);
        return Database.countQuery(query);
    }

    // * This is the helper method to apply filter (WHERE condition) on the query
    static String addFilter(String query, Map<String, String> recordsFilter) {
        if(recordsFilter!=null && !recordsFilter.isEmpty()) {
            query += ' WHERE ';
            for(String fieldName : recordsFilter.keySet()) {
                query += fieldName + ' = \'' + String.escapeSingleQuotes(recordsFilter.get(fieldName)) + '\'';
            }
        }
        return query;
    }
}
