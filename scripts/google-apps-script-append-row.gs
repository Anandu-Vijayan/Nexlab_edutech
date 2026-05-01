/**
 * Google Apps Script — append registration rows from your NeXlab site
 *
 * Setup:
 * 1. Create a Google Sheet (or open an existing one).  
 * 2. Extensions → Apps Script → paste this file's code (replace any default code).
 * 3. Save. Click Deploy → New deployment → type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone (so your public site can POST; the URL is unlisted—treat it like an API key)
 * 4. Copy the Web app URL into your project's .env:
 *    NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/XXXX/exec
 * 5. After any code change: Deploy → Manage deployments → Edit (pencil) → Version "New version" → Deploy.
 */

  var HEADERS = ["Timestamp", "Name", "Phone", "Email", "Address", "Class", "School", "Submitted At (ISO)"];

  function doPost(e) {
    var lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      if (!e.postData || !e.postData.contents) {
        return jsonResponse({ ok: false, error: "Missing body" });
      }

      var data = JSON.parse(e.postData.contents);

      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
      
      // Add headers if the sheet is empty
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(HEADERS);
        // Make header row bold
        sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      }
      
      var now = new Date();

      sheet.appendRow([
        now,
        String(data.name || ""),
        String(data.phone || ""),
        String(data.email || ""),
        String(data.address || ""),
        String(data.studentClass || ""),
        String(data.school || ""),
        String(data.submittedAtIso || ""),
      ]);

      return jsonResponse({ ok: true });
    } catch (err) {
      return jsonResponse({ ok: false, error: String(err) });
    } finally {
      lock.releaseLock();
    }
  }

  function doGet() {
    return ContentService.createTextOutput("NeXlab registration endpoint — use POST with JSON.").setMimeType(
      ContentService.MimeType.TEXT
    );
  }

  function jsonResponse(obj) {
    return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
  }

  /**
  * Run this function once manually to add headers to an existing sheet.
  * Go to: Run → Select "addHeaders" → Click Run
  */
  function addHeaders() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    
    // Insert a new row at the top if sheet has data
    if (sheet.getLastRow() > 0) {
      sheet.insertRowBefore(1);
    }
    
    // Add headers to row 1
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    
    Logger.log("Headers added successfully!");
  }
