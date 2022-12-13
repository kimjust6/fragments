const sharp = require('sharp');

export async function getMetadata() {
  try {
    const metadata = await sharp('./src/sharp/justin.gif').metadata();
    console.log(metadata);
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);
  }
}

export async function imageToJpeg(data) {
  return imageConverter(data, 'jpg');
}

export async function imageToPng(data) {
  return imageConverter(data, 'png');
}

export async function imageToWebp(data) {
  return imageConverter(data, 'webp');
}

export async function imageToGif(data) {
  return imageConverter(data, 'gif');
}

async function imageConverter(data, extension) {
  var options = {};
  if (extension == 'jpeg' || extension == 'jpg') {
    options = { mozjpeg: true };
  } else if (extension == 'png') {
    options = { palette: true };
  } else if (extension == 'webp') {
    options = { lossless: true };
  } else if (extension == 'gif') {
    options = {};
  }

  try {
    await sharp(data)
      .toFormat(extension, options)
      .toFile('./src/sharp/justin.' + extension);
  } catch (error) {
    console.log(error);
  }
}
