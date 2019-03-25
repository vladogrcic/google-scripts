var sheetName = "Sheet"; // The name of the sheet where to save the data
var caseInsensitive = false; // Make the Header/Data matching system case insensitive
var useKey = "title"; // What key from the retrieved data to use for matching with the header
var headerRange = "A1:X1"; // Header range, must be 1 row high

function doPost(request) {
    var jsonString = request.postData.getDataAsString();
    var jsonData = JSON.parse(jsonString);
    // Docs: https://help.paperform.co/after-submission-and-integrations/how-to-use-webhooks

    var data = {};
    var reqData = jsonData.data;
    for (var i = 0; i < reqData.length; i++) {
        var item = reqData[i];
        data[item[useKey]] = item.value;
    }

    appendRow(data);
    var content = {
        "status": "SUCCESS",
    };
    return ContentService.createTextOutput(JSON.stringify(content)).setMimeType(ContentService.MimeType.JSON);
}

function appendRow(data) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    var headerMapping = _getHeaderMapping();
    var rowValues = new Array(sheet.getLastColumn());

    // Initialize with empty strings
    for (var i = 0; i < rowValues.length; i++) {
        rowValues[i] = "";
    }

    // Fill data
    for (var key in data) {
        if (!data.hasOwnProperty(key)) continue;
        var lcKey = key.trim();
        if (caseInsensitive) {
            lcKey = lcKey.toLowerCase();
        }
        var cellIndex = headerMapping[lcKey];
        if (cellIndex !== null && cellIndex !== undefined) {
            rowValues[cellIndex] = data[key];
        }
    }

    // Update spreadsheet
    sheet.appendRow(rowValues);
}

function _getHeaderMapping() {
    var header = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName).getRange(headerRange).getValues()[0];
    var headerMapping = {};
    for (var i = 0; i < header.length; i++) {
        if (header[i] === "") continue;
        var key = header[i].trim();
        if (caseInsensitive) {
            key = key.toLowerCase();
        }
        headerMapping[key] = i;
    }
    return headerMapping;
}



function _test() {
    // Web test: ?email=123&name=fdf
    appendRow({
        "Email": "Email of user",
        "Name": "Name of user",
    });
}
