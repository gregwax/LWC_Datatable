// * Controller class for Contact Datatable
public with sharing class ContactDatatableController {

    // * This method is used to return the list of contacts
    @AuraEnabled
    public static List<Contact> getContacts() {
        return [SELECT Name, Account.Name, Phone, Email, LeadSource, MailingAddress FROM Contact ORDER BY Name ASC];
    }
}
