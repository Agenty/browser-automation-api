
// Go to the page, auto fill web form, capture screenshot

module.exports = async ({ page, request }) => {
    const response = await page.goto('http://demo.imacros.net/Automate/TestForm1');            
    const statusCode = response.status();
    console.log(statusCode);
    
    // Enter name from request object
    await page.type("#name", request.name);
    // Select food from request object
    await page.select("#food", request.food);
    // Select drink from request object
    await page.select("#drink", request.drink);
    // Click on medium size
    await page.click("#medium");
   
    // Select multiple desserts
    // desserts = ['chocolate cake', 'apple pie'];
    // use spread operator for array https://github.com/puppeteer/puppeteer/issues/5948
    await page.select("#dessert", ...request.desserts);
    
    // Click on Yes customer
    await page.click("input[name='Customer'][value='Yes']");
    
    // Enter 1234 in pass
    await page.type('input[name="Reg_code"]', "1234");
    
    // Enter the Remarks in textarea
    await page.type("textarea[name='Remarks']", "Auto fill web form");
    
    // Capture scrreenshot after auto-fill
    await page.screenshot({path : 'form.png'});
    
    return {
        data : { statusCode },
        type : 'application/json'
    };   
};