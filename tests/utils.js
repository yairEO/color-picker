module.exports.loadVisualTest = async name => {
  // Load page
  await page.goto(`http://localhost:5000/tests/visual/${name}`, {
      waitUntil: 'load' // networkidle doesn't work on firefox, it get's stuck
  })

  // Wait until the next frame
  await page.evaluate(() => new Promise(requestAnimationFrame))
}