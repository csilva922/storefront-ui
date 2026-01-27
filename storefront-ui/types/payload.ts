import type { Category, Banner, Media , Page} from "./payload-types";

export type { Category, Banner, Media, Page };

type LayoutBlock = NonNullable<Page['layout']>[number]

export type BannerBlock = Extract<LayoutBlock, { blockType: 'banner' }>
export type CategoriesBlock = Extract<LayoutBlock, { blockType: 'categories' }>
export type ContentBlock = Extract<Page["layout"][0], { blockType: 'content' }>

export type PageBlock = BannerBlock | CategoriesBlock | ContentBlock