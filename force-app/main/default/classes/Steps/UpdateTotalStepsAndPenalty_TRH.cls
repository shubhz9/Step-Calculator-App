/**
 * @description       : 
 * @author            : Shubham Raut
 * @date              : 02-05-2025
 * @group             : ITBA
 * @last modified on  : 02-05-2025
 * @last modified by  : Shubham Raut
**/
public with sharing class UpdateTotalStepsAndPenalty_TRH {

    public static Boolean skipTrigger = false;

    public static void updateTotalStepsAndPenalty(List<Steps__c> newRecords, Map<Id, Steps__c> oldRecordsMap) {
        if(!skipTrigger){
            List<Steps__c> recordsToProcess = new List<Steps__c>();
            for(Steps__c newRecord: newRecords){
                Steps__c oldRecord = oldRecordsMap.get(newRecord.Id);
                if(oldRecord != null && newRecord.Todays_Steps__c != oldRecord.Todays_Steps__c){
                    Steps__c recordToUpdate = new Steps__c();
                    recordToUpdate.Id = newRecord.Id;
                    recordToUpdate.Penalty__c = (newRecord.Todays_Steps__c - newRecord.Total_Steps__c) < newRecord.Streak__c ? newRecord.Penalty__c + 1 : newRecord.Penalty__c;
                    recordToUpdate.Streak__c = newRecord.Todays_Steps__c - newRecord.Total_Steps__c;
                    recordToUpdate.Total_Steps__c = newRecord.Todays_Steps__c;
                    if(newRecord.Golden_Point__c > 0 && newRecord.Golden_Point__c != oldRecord.Golden_Point__c && recordToUpdate.Streak__c < 25000){
                        recordToUpdate.Golden_Point__c = newRecord.Golden_Point__c - 1;
                    }

                    recordsToProcess.add(recordToUpdate);
                }
            }

            Database.update(recordsToProcess, true);
        }
    }
}