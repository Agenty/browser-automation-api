
// Read the `url` from request, goto the login page, enter username, password and click on login btn
// Capture screenshot and extract some fields form dashboard page.

module.exports = async ({ page, request }) => {
    
    // Go to login page and enter username, password and click on login btn
    await page.goto('https://sandbox.moodledemo.net/login/index.php');            
    await page.type('#username', 'admin');
    await page.type('#password', 'sandbox');
    await page.click('#loginbtn');
    
    // Capture screenshot after login
    await page.screenshot({path : 'sandbox.png'})
    
    // Extract some courses after login page
    const result = await page.evaluate(() => {
        const data = [];
        var courses = document.querySelectorAll('.coursebox');
        for (var course of courses) {
            
            var obj = {};
            var name = course.querySelector('.coursename');
            if(name){
                obj.name = name.textContent;
            }
            
            var teacher = course.querySelector('.teachers');
            if(teacher){
                obj.teacher = teacher.textContent;
            }
            
            var summary = course.querySelector('.summary');
            if(summary){
                obj.summary = summary.textContent;
            }
            
            data.push(obj);
        }
        return data;
    });
    
    return {
        data : result,
        type : 'application/json'
    };   
};