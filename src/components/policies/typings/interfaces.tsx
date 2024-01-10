import { ReactNode } from 'react';

export type TLegalContent = ILegalItem[];
export type TLegalTitle = string;
export type TLegalParagraphs = string | ReactNode;
export type TLegalAnchor = ILegalBase[];
export type TVersion = `${string}.${string}.${string}`
export type TDays = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29' | '30' | '31';
export type TMonths = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';
export type TYears = string
export type TLastUpdate = `${TDays}/${TMonths}/${TYears}`;
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
	termsVersion: TVersion;
	termsLastUpdate: TLastUpdate
}

export interface IDateVersion{
	termsVersion: TVersion;
	termsLastUpdate: TLastUpdate
}

export interface IBreadCrumbles {
	currentPage: String;
}
