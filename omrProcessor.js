const cv = require('opencv4nodejs');

async function processOMR(imagePath) {
    // 1. Read the image
    const img = cv.imread(imagePath);

    // 2. Convert to grayscale
    const gray = img.cvtColor(cv.COLOR_BGR2GRAY);

    // 3. Blur (reduce noise)
    const blurred = gray.gaussianBlur(new cv.Size(5, 5), 0);

    // 4. Threshold (binary image)
    const thresh = blurred.threshold(150, 255, cv.THRESH_BINARY_INV);

    // 5. Find contours (potential bubbles)
    const contours = thresh.findContours(
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
    );

    // 6. Filter & process contours (demo: by area)
    let detectedAnswers = [];
    contours.forEach(c => {
        if (c.area > 100 && c.area < 2000) { // Example area threshold—tune as per your OMR sheet
            const rect = c.boundingRect();
            detectedAnswers.push({
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
                area: c.area
            });
        }
    });

    // You would map detected contours to OMR answer keys here
    // For demonstration, just return bounding boxes of potential answers
    return {
        numberOfDetected: detectedAnswers.length,
        detectedAnswers
    };
}

module.exports = { processOMR };
