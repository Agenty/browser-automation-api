
// Read the `url` from request, goto the page, extract title and return the results

module.exports = async ({ page, request }) => {
    const response = await page.goto('http://books.toscrape.com/');            
    
    console.log(response.status());
    
    const result = {
        url : response.url(),
        status : response.status(),
        title : await page.title(),
    };
    
    return {
        data : result,
        type : 'application/json'
    };   
};