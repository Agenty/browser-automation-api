
// Read the `url` from request, goto the page, extract title and return the results

module.exports = async ({ page, request }) => {
    const response = await page.goto(request.url);
    console.log(response.status());
    const btn = await page.waitForSelector('#download-link');

    // Get all attributes value in array
    var props = await page.evaluate(
      element => Array.from(element.attributes, ({ name, value }) => `${value}`),
      btn
    );
    
    // Check if any attribute has data:text/csv.
    var content = props.find(x => x.indexOf('data:text') > -1);
    if(content)
    {
        content = content.replace("data:text/csv;charset=utf-8,", "");
        content = decodeURIComponent(content);
    }
    
    // Convert the CSV content to JSON
    const neatCsv = require('neat-csv');
    const json = await neatCsv(content);
    
    return {
        data : json,
        type : 'application/json'
    };   
};