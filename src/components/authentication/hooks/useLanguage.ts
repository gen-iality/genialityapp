import { Lang } from '../types';

export default function useLanguage() {
	const lang = (window?.navigator?.language ? window?.navigator?.language.substring(0, 2) : 'es') as Lang;
	return { lang };
}
