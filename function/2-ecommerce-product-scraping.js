// Read the `url` from request, goto the page, extract products
// capture screenshot and return the results

module.exports = async ({ page, request }) => {
    const response = await page.goto(request.url);
    console.log(response.status());
    const result = await page.evaluate(() => {
        const data = [];
        var products = document.querySelectorAll('.product_pod');
        for (var product of products) {
            data.push({
                product_name: product.querySelector('h3').textContent,
                product_price: product.querySelector('.price_color').textContent,
                product_availability: product.querySelector('.availability').textContent,
                product_image: "http://books.toscrape.com" + product.querySelector('.thumbnail').getAttribute("src"),
                product_link: "http://books.toscrape.com" + product.querySelector('h3 > a').getAttribute("href")
            });
        }
        return data;
    });

    await page.screenshot({ path: 'books-toscrape.png', fullPage: true });

    return {
        data: result,
        type: 'application/json'
    };
};