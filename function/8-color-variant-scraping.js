// Read the `url` from request, goto the page, extract product
// color variants, sizes etc and return the results

module.exports = async ({ page, request }) => {
    const response = await page.goto(request.url);
    console.log(response.status());
    const result = await page.evaluate(() => {
        
        // custom function to getText with clean/trim
        const getText = function (element) {
            if (element) {
                var value = element.textContent;
                value = value.replace(/(\r\n|\n|\r)/gm, "");
                value = value.trim();
                return value;
            }
            return null;
        }
        
        const data = [];
        
        var sizes = document.querySelectorAll('.swatches .swatch:nth-child(1) .swatch-element');
        var sizesList = [];
        for(var size of sizes){
            sizesList.push(getText(size));
        }
        
        var colors = document.querySelectorAll('.swatches .swatch:nth-of-type(2) input');
        for(var color of colors){
            var row  = {};
            row.productName = document.querySelector('h1').textContent;
            row.color = color.getAttribute('value');
            row.price = getText(document.querySelector('#price-preview'));
            row.bigImage = document.querySelector('#big-image').getAttribute('data-src');
            row.sizes = sizesList;
            
            data.push(row);
        }
        
        return data;
    });

    await page.screenshot({ path: 'shopify.png', fullPage: false });

    return {
        data: result,
        type: 'application/json'
    };
};