// Read the `url` from request, goto the page, extract products
// click on next button and repeat until maxPages, then return the results

module.exports = async ({ page, request }) => {
    console.log('Navigating...');
    await page.goto(request.url);

    const maxPages = request.maxPages || 3;
    const result = [];
    
    for(var p = 0; p < maxPages; p++){
      
     // Extract page content 
     const pageResult = await page.evaluate(() => {
        const data = [];
        var products = document.querySelectorAll('.product_pod');
        for (var product of products) {
            data.push({
                product_name: product.querySelector('h3').textContent,
                product_price: product.querySelector('.price_color').textContent,
                product_availability: product.querySelector('.availability').textContent,
                product_image: product.querySelector('.thumbnail').getAttribute("src"),
                product_link: product.querySelector('h3 > a').getAttribute("href")
            });
        }
            return data;
      });
      
      console.log(`Found ${pageResult.length} products on page ${p}`);
      
      // push page result to outer array;
      result.push(...pageResult);
      
      // Click on next button
      console.log('Click next...');
      await page.click('.next a');

    }
    
    return {
        data: result,
        type: 'application/json'
    };
};