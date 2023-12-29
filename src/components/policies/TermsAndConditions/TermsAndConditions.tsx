import { termsAnchor, termsContent, termsParagraph, termsTitle } from './termsConstants';
import LegalTemplate from '../LegalTemplate';
import BreadCrumbles from '../BreadCrumbles';
import { legalPage } from '../constant';

const TermsAndConditions = () => {
	return (
		<LegalTemplate
			breadCrumbles={<BreadCrumbles currentPage={legalPage.TERMS_AND_CONDITIONS} />}
			termsAnchor={termsAnchor}
			termsContent={termsContent}
			termsParagraph={termsParagraph}
			termsTitle={termsTitle}
		/>
	);
};
export default TermsAndConditions;
