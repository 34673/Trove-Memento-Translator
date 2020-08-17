function main(){
    //Placeholder before url is used.
    French.setup();
    //urlSetup();
    importWeekly(Global.remoteId,Global.remoteTab,French.weeklyTab);
    translate(French.toTranslate);
    restoreFormulas(French.weeklyTab);
}
function urlSetup(){
    let url = SpreadsheetApp.getActiveSpreadsheet().getUrl();
    //if(!url.indexOf(language)){return;}
}
function importWeekly(remoteId,remoteTab,localTab){
    let remoteSheet = SpreadsheetApp.openById(remoteId).getSheetByName(remoteTab);
    let remoteRange = remoteSheet.getDataRange();
    let localSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(localTab);
    let localRange = localSheet.getRange(1,1,remoteRange.getNumRows(),remoteRange.getNumColumns());
    localRange.setValues(remoteRange.getValues());
}
function translate(sheetNames){
    for(let sheetIndex in sheetNames){
        let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetNames[sheetIndex]);
        let rows = sheet.getLastRow();
        let columns = sheet.getLastColumn();
        let range = sheet.getRange(1,1,rows,columns);
        let values = range.getValues();
        for(let rowIndex=0;rowIndex<rows;rowIndex++){
            for(let columnIndex=0;columnIndex<columns;columnIndex++){
                let oldValue = values[rowIndex][columnIndex].toString();
                let newValue = Global.translationMap[oldValue];
                if(newValue != null){
                    values[rowIndex][columnIndex] = newValue;
                }
            }
        }
        range.setValues(values);
    }
}
function restoreFormulas(weeklyTab){
    //Wait for translation to end.
    Utilities.sleep(500);
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(weeklyTab);
    let rows = sheet.getLastRow();
    let formulaRange = sheet.getRange(1,5,rows,2);
    let values = formulaRange.getValues();
    let collectionSheet = French.collectionTab;
    for(let rowIndex=0;rowIndex<rows;rowIndex++){
        let indexString = (rowIndex+1).toString();
        values[rowIndex][0] = "=INDIRECT(\""+collectionSheet+"!B\"&MATCH(C"+indexString+","+collectionSheet+"!$C$1:$C$120,0))&F"+indexString;
        values[rowIndex][1] = "=IF((MATCH(C"+indexString+","+collectionSheet+"!$C$1:$C$120,0))>=119,0,IF((MATCH(C"+indexString+","+collectionSheet+"!$C$1:$C$120,0))>=109,3,IF((MATCH(C"+indexString+","+collectionSheet+"!$C$1:$C$120,0))>=81,2,1)))";
    }
    formulaRange.setFormulas(values);
}
