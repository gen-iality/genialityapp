import { ReactNode } from 'react';

export type TLegalContent = ILegalItem[];
export type TLegalTitle = string;
export type TLegalParagraphs = string | ReactNode;
export type TLegalAnchor = ILegalBase[];
interface ILegalBase {
	title: string | ReactNode;
	anchor: string;
}

export interface ILegalItem extends ILegalBase {
	content: string | ReactNode;
}

export interface ILegalTemplate {
	breadCrumbles?: ReactNode;
	termsTitle: TLegalTitle;
	termsParagraph?: TLegalParagraphs;
	termsAnchor: TLegalAnchor;
	termsContent: TLegalContent;
}

export interface IBreadCrumbles {
	currentPage: String;
}
