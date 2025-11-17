const sharp = require('sharp');

/**
 * Add watermark to image
 * @param {Buffer} imageBuffer - Original image buffer
 * @param {Object} options - Watermark options
 * @returns {Promise<Buffer>} - Watermarked image buffer
 */
async function addWatermark(imageBuffer, options = {}) {
  const {
    text = '© Samrat Agencies',
    position = 'bottom-right', // top-left, top-right, bottom-left, bottom-right, center
    opacity = 0.3,
    fontSize = 24,
    color = 'white',
    padding = 20,
  } = options;

  try {
    // Get image metadata
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    // Create SVG watermark
    const watermarkSvg = createWatermarkSVG(text, {
      fontSize,
      color,
      opacity,
    });

    // Calculate position
    const svgWidth = text.length * fontSize * 0.6; // Approximate
    const svgHeight = fontSize * 1.5;

    let left, top;

    switch (position) {
      case 'top-left':
        left = padding;
        top = padding;
        break;
      case 'top-right':
        left = width - svgWidth - padding;
        top = padding;
        break;
      case 'bottom-left':
        left = padding;
        top = height - svgHeight - padding;
        break;
      case 'bottom-right':
        left = width - svgWidth - padding;
        top = height - svgHeight - padding;
        break;
      case 'center':
        left = (width - svgWidth) / 2;
        top = (height - svgHeight) / 2;
        break;
      default:
        left = width - svgWidth - padding;
        top = height - svgHeight - padding;
    }

    // Add watermark
    const watermarkedBuffer = await image
      .composite([
        {
          input: Buffer.from(watermarkSvg),
          top: Math.round(top),
          left: Math.round(left),
        },
      ])
      .toBuffer();

    return watermarkedBuffer;
  } catch (error) {
    console.error('Error adding watermark:', error);
    return imageBuffer; // Return original if watermarking fails
  }
}

/**
 * Add tiled watermark pattern across image (for stronger protection)
 * @param {Buffer} imageBuffer - Original image buffer
 * @param {Object} options - Watermark options
 * @returns {Promise<Buffer>} - Watermarked image buffer
 */
async function addTiledWatermark(imageBuffer, options = {}) {
  const {
    text = '© Samrat Agencies',
    opacity = 0.15,
    fontSize = 20,
    color = 'white',
    angle = -30, // Diagonal angle
    spacing = 150, // Space between watermarks
  } = options;

  try {
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    // Calculate number of watermarks needed
    const cols = Math.ceil(width / spacing) + 1;
    const rows = Math.ceil(height / spacing) + 1;

    // Create watermark overlays
    const overlays = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const watermarkSvg = createWatermarkSVG(text, {
          fontSize,
          color,
          opacity,
          rotate: angle,
        });

        overlays.push({
          input: Buffer.from(watermarkSvg),
          top: row * spacing,
          left: col * spacing,
        });
      }
    }

    // Apply all watermarks
    const watermarkedBuffer = await image.composite(overlays).toBuffer();

    return watermarkedBuffer;
  } catch (error) {
    console.error('Error adding tiled watermark:', error);
    return imageBuffer;
  }
}

/**
 * Create SVG watermark
 */
function createWatermarkSVG(text, options = {}) {
  const {
    fontSize = 24,
    color = 'white',
    opacity = 0.3,
    rotate = 0,
  } = options;

  const textWidth = text.length * fontSize * 0.6;
  const textHeight = fontSize * 1.5;

  return `
    <svg width="${textWidth}" height="${textHeight}">
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.5"/>
        </filter>
      </defs>
      <g transform="rotate(${rotate} ${textWidth / 2} ${textHeight / 2})">
        <text
          x="50%"
          y="50%"
          font-family="Arial, sans-serif"
          font-size="${fontSize}"
          font-weight="bold"
          fill="${color}"
          opacity="${opacity}"
          text-anchor="middle"
          dominant-baseline="middle"
          filter="url(#shadow)"
        >${text}</text>
      </g>
    </svg>
  `;
}

/**
 * Add invisible digital watermark (steganography)
 * Embeds metadata that can be used to prove ownership
 */
async function addInvisibleWatermark(imageBuffer, metadata = {}) {
  try {
    const image = sharp(imageBuffer);

    // Add EXIF/IPTC metadata
    const watermarkedBuffer = await image
      .withMetadata({
        exif: {
          IFD0: {
            Copyright: metadata.copyright || '© Samrat Agencies. All Rights Reserved.',
            Artist: metadata.artist || 'Samrat Agencies',
            ImageDescription: metadata.description || 'Protected by Samrat Agencies',
          },
        },
      })
      .toBuffer();

    return watermarkedBuffer;
  } catch (error) {
    console.error('Error adding invisible watermark:', error);
    return imageBuffer;
  }
}

module.exports = {
  addWatermark,
  addTiledWatermark,
  addInvisibleWatermark,
};
