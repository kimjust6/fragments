const sharp = require('sharp');

export async function getMetadata() {
  try {
    const metadata = await sharp('./src/sharp/sammy.gif').metadata();
    console.log(metadata);
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);
  }
}

export async function imageToJpeg() {
  return imageConverter('jpg');
}

export async function imageToPng() {
  return imageConverter('png');
}

export async function imageToWebp() {
  return imageConverter('webp');
}

export async function imageToGif() {
  return imageConverter('gif');
}

async function imageConverter(extension) {
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
    await sharp('./src/sharp/sammy.jpg')
      .toFormat(extension, options)
      .toFile('./src/sharp/sammy.' + extension);
  } catch (error) {
    console.log(error);
  }
}
