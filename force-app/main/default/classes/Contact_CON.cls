/**
 * @description       : 
 * @author            : $username  Deloitte
 * @date              : 02-04-2025
 * @group             : ITBA
 * @last modified on  : 02-04-2025
 * @last modified by  : Shubham Raut
**/
public with sharing class Contact_CON {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getStepCompetitionContacts(){
        try {
            List<Contact> allContacts = [SELECT ID, Name, MobilePhone, Email FROM Contact WHERE Account.Name = 'Step Competition' LIMIT 40000];
            if(allContacts != null)
                return allContacts;
            return new List<Contact>();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}