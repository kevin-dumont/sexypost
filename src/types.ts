import { type } from "os";

export interface ListItem {
  title: string;
  description?: string;
}

export interface FooterInfo {
  name: string;
  subtitle?: string;
  photoUrl: string;
  rightText: string;
}

export type GradientDirection = 'to right' | 'to bottom right' | 'to bottom' | 'to bottom left' | 'to left' | 'to top left' | 'to top' | 'to top right';
export type GradientType = 'linear' | 'radial';

export interface BackgroundStyle {
  type: 'solid' | 'gradient' | 'image';
  color: string;
  gradientColor?: string;
  gradientDirection?: GradientDirection;
  gradientType?: GradientType;
  accentColor: string;
  imageUrl?: string;
  imageDarkness?: number;
}

export interface CardStyle {
  backgroundColor: string;
  opacity: number;
  showBorder: boolean;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
}

export interface ItemNumberStyle {
  backgroundColor: string;
  opacity: number;
  showBorder: boolean;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  padding: number;
  fixedSize: boolean;
  width: number;
  height: number;
}

export interface FooterStyle {
  name: string;
  subtitle?: string;
  photoUrl: string;
  rightText: string;
}

export interface TextColors {
  title: string;
  itemTitle: string;
  description: string;
  itemNumber: string;
  footerName: string;
  footerSubtitle: string;
  footerRight: string;
}

export interface Spacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PostStyle {
  name: string;
  background: BackgroundStyle;
  titleSize: number;
  itemTitleSize: number;
  descriptionSize: number;
  footerSize: number;
  footerSubtitleSize: number;
  itemSpacing: number;
  itemPadding: Spacing;
  contentPadding: Spacing;
  footerPadding: Spacing;
  titleDescriptionSpacing: number;
  itemNumberSize: number;
  showItemNumbers: boolean;
  itemNumberStyle: ItemNumberStyle;
  font: string;
  footer: FooterStyle;
  colors: TextColors;
  card: CardStyle;
}