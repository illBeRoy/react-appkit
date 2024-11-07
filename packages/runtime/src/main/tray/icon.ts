import { nativeImage } from 'electron';
import { intToRGBA, Jimp, ResizeStrategy, rgbaToInt } from 'jimp';

export const emptyIcon = nativeImage.createFromDataURL(
  'data:image/png;base64,',
);

export const trayIcon = async (imageDataUri: string) => {
  const [template1x, template2x] = await Promise.all([
    createTemplateImage(imageDataUri, '@1x'),
    createTemplateImage(imageDataUri, '@2x'),
  ]);

  const trayIcon = nativeImage.createFromDataURL(template1x);
  trayIcon.setTemplateImage(true);
  trayIcon.addRepresentation({ scaleFactor: 1, dataURL: template2x });

  return trayIcon;
};

const createTemplateImage = async (
  imageDataUri: string,
  size: '@1x' | '@2x',
) => {
  const template = await Jimp.read(imageDataUri);

  template.contain({
    w: size === '@1x' ? 16 : 32,
    h: size === '@1x' ? 16 : 32,
    mode: ResizeStrategy.NEAREST_NEIGHBOR,
  });

  template.scan((x, y) => {
    if (intToRGBA(template.getPixelColor(x, y)).a <= 128) {
      template.setPixelColor(0, x, y);
    } else {
      template.setPixelColor(rgbaToInt(0, 0, 0, 255), x, y);
    }
  });

  return template.getBase64('image/png');
};
