/**
 * @description       : 
 * @author            : $username  Deloitte
 * @date              : 02-06-2025
 * @group             : ITBA
 * @last modified on  : 02-06-2025
 * @last modified by  : Shubham Raut
**/
public with sharing class Competition_CON {
    @AuraEnabled(cacheable=true)
    public static List<Competition__c> getCompetitions(){
        try {
            List<Competition__c> allActiveCompetitions = [SELECT Id, Competition_Name__c, End_Date__c, Start_Date__c, Winner__c FROM Competition__c WHERE IsActive__c = true LIMIT 40000];
            if(allActiveCompetitions != null)
                return allActiveCompetitions;
            return new List<Competition__c>();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}