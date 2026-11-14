import { DEFAULT_LOGO_SVG } from '../assets/default-logo-svg';

/**
 * Returns the SVG string with all fill attributes and root/group tags filled by the specified color.
 */
export function getColoredLogoSvg(color: string = '#ffffff'): string {
  const safeColor = color || '#ffffff';
  let res = DEFAULT_LOGO_SVG;
  // Ensure root svg has fill so any untagged elements inherit the exact color
  res = res.replace(/<svg\s+/, `<svg fill="${safeColor}" `);
  // Ensure all <g> tags have explicit fill
  res = res.replace(/<g\s+stroke-width="0">/g, `<g fill="${safeColor}" stroke-width="0">`);
  // Replace all existing fill attributes
  res = res.replace(/fill="[^"]+"/g, `fill="${safeColor}"`);
  return res;
}

/**
 * Returns a data: URI for the colored SVG, suitable for <img :src="..."> and new Image().src
 */
export function getLogoDataUri(color: string = '#ffffff'): string {
  const svg = getColoredLogoSvg(color);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
