
// Read the `url` from request, goto the page, capture screenshot and return the results

module.exports = async ({ page, request }) => {
    const response = await page.goto(request.url);  
    console.log(`statusCode : ${response.status()}`);
    
    await page.screenshot({path : 'example.png'});
    
    return {
        data : {},
        type : 'application/json'
    };   
};