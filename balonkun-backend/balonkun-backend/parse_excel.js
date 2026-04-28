const XLSX = require('xlsx');

try {
    const workbook = XLSX.readFile('C:\\Users\\prabh\\OneDrive\\Documents\\audio&security.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`Total Rows: ${data.length}`);
    console.log('--- Sample (first 5) ---');
    console.log(JSON.stringify(data.slice(0, 5), null, 2));
    
    // Check if there are more sheets
    if (workbook.SheetNames.length > 1) {
        console.log(`\nNote: There are other sheets: ${workbook.SheetNames.join(', ')}`);
    }
} catch (error) {
    console.error('Error reading the excel file:', error);
}
