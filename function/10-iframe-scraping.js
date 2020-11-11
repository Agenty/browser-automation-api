
// Read the `url` from request, goto the page, get iframe content and scrape the table from iframe

module.exports = async ({ page, request }) => {
    
    const response = await page.goto(request.url);
    console.log(response.status());
    
    // Find the right frame using selector.
    const elementHandle = await page.$('#table');
    const frame = await elementHandle.contentFrame();

    console.log(`iFrame URL : ${frame.url()}`);
    
    const result = await frame.evaluate(() => {
        const data = [];
        var rows = document.querySelectorAll('table tr:not(:first-child)');
        for (var row of rows) {
            data.push({
                name : row.querySelector('td:nth-child(1)').textContent,
                city : row.querySelector('td:nth-child(2)').textContent,
                zip : row.querySelector('td:nth-child(3)').textContent,
            });
        }
        return data;
    });
    
    return {
        data : result,
        type : 'application/json'
    };   
};