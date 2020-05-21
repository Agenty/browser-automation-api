
// Read the `url` from request, goto the page, extract and infinite scroll and return the results

module.exports = async ({ page, request }) => {
    
    function extractItems() {
      const extractedElements = document.querySelectorAll('.quote');
      const items = [];
      for (let element of extractedElements) {
        var item = {
              author : element.querySelector('.author').innerText,
              text : element.querySelector('.text').innerText,
              tags : []
        };
        
        var tags = element.querySelectorAll('.tags a');
        for(var tag of tags){
            item.tags.push(tag.innerText);
        }
        
        items.push(item);
        
      }
      return items;
    }
    
    async function scrapeInfiniteScrollItems(
      page,
      extractItems,
      itemTargetCount,
      scrollDelay = 500,
    ) {
      let items = [];
      try {
        let previousHeight;
        while (items.length < itemTargetCount) {
          items = await page.evaluate(extractItems);
          previousHeight = await page.evaluate('document.body.scrollHeight');
          await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
          await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
          await page.waitFor(scrollDelay);
        }
      } catch(e) { }
      return items;
    }
    
    let response = await page.goto(request.url);
    console.log(`Response: ${response.status()}`);
    
    // Scroll and extract items from the page.
    const items = await scrapeInfiniteScrollItems(page, extractItems, 50);

    return {
        data : items,
        type : 'application/json'
    };   
};