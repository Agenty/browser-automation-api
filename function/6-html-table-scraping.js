// Read the `url` from request, goto the page, extract table
// columns excludiong heading and return the results

module.exports = async ({ page, request }) => {
    const response = await page.goto(request.url);
    console.log(response.status());
    const result = await page.evaluate(() => {
        const data = [];
        var rows = document.querySelectorAll('#customers tr:not(:first-child)');
        for (var row of rows) {
            data.push({
                company: row.querySelector('td:nth-child(1)').textContent,
                contact: row.querySelector('td:nth-child(2)').textContent,
                country: row.querySelector('td:nth-child(3)').textContent,
            });
        }
        return data;
    });

    await page.screenshot({ path: 'html-table.png', fullPage: false });

    return {
        data: result,
        type: 'application/json'
    };
};