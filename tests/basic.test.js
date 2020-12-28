const { loadVisualTest } = require('./utils')

describe('color picker', () => {

    it('Should display Hue, Saturation, Lightness & Alpha range sliders', async () => {
        await loadVisualTest('basic.html')
        expect(await page.screenshot()).toMatchImageSnapshot()
    })

    it('Should display 4 colors in the swatches: red, blue, green, pink', async () => {
        await loadVisualTest('swatches.html')
        expect(await page.screenshot()).toMatchImageSnapshot()
    })

    // it('Should call all callbacks with correct arguments', async() => {
    //     await page.goto(`http://localhost:5000/tests/visual/basic.html`)

    //     page.click('.color-picker')

    //     expect(1).toEqual(1)
    // })
})