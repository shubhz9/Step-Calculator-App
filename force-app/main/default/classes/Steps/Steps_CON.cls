/**
 * @description       : 
 * @author            : $username  Deloitte
 * @date              : 02-05-2025
 * @group             : ITBA
 * @last modified on  : 02-05-2025
 * @last modified by  : Shubham Raut
**/
public with sharing class Steps_CON {
    @AuraEnabled
    public static string upsertSteps(String payload){
        try {
            if(Steps_SRV.upsertSteps(payload)){
                return 'SUCCESS';
            }
            return 'FAILURE';
        } catch (Exception e) {
            return 'FAILURE';
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Steps__c> getStepsData(){
        try {
            List<Steps__c> steps = [SELECT Id, Name, Total_Steps__c, Penalty__c, Golden_Point__c, Contact__r.Name, Contact__c, Todays_Steps__c, Streak__c FROM Steps__c WHERE Contact__r.Account.Name = 'Step Competition'];
            if(steps != null)
                return steps;
            return new List<Steps__c>();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}