import { ReactNode } from 'react';

export type TLegalContent = ILegalItem[];
export type TLegalTitle = string;
export type TLegalParagraph = string;
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
	termsParagraph?: TLegalParagraph;
	termsAnchor: TLegalAnchor;
	termsContent: TLegalContent;
}

export interface IBreadCrumbles {
	currentPage: String;
}
