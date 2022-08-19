const puppeteer = require('puppeteer');

const Crawler = async (username, password) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            ignoreDefaultArgs: ['--disable-extensions'],
            args: [
                '--incognito',
                '--use-gl=egl'
            ],
        });
        const page = await browser.newPage();
        await page.goto('https://www.instagram.com/accounts/login', { waitUntil: "networkidle2" });
        await page.type('input[name=username]', `${username}`, { delay: 20 });
        await page.type('input[name=password]', `${password}`, { delay: 20 });
        await page.click('button[type=submit]', { delay: 20 });
        await page.waitForTimeout(5000)

        const notifyBtns = await page.$x("//button[contains(text(), 'Not Now')]");
        if (notifyBtns.length > 0) {
            await notifyBtns[0].click();
        } else {
            console.log("No notification buttons to click.");
        }
        await page.goto(`https://www.instagram.com/${username}`, { waitUntil: "networkidle2" });
        await page.waitForTimeout(5000)
        const res = await page.$('section > div > h1');
        const result = res && await res.evaluate(x => x.innerText);
        // await browser.close();
        return {
            result
        };

    } catch (error) {
        console.log(error)
    }
}

module.exports = { Crawler };