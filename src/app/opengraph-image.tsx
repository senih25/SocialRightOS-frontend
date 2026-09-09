import { renderSocialShareImage } from "@/lib/social-share-image";

export const alt =
  "Dijital Sosyal Hak Rehberi — sosyal haklara erişimde sade ve güven veren dijital rehber";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderSocialShareImage();
}
