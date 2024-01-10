import LegalTemplate from '../LegalTemplate';
import BreadCrumbles from '../BreadCrumbles';
import { legalPage } from '../constant';
import {
	privacyAnchor,
	privacyContent,
	privacyLastUpdate,
	privacyParagraph,
	privacyTitle,
	privacyVersion,
} from './privacyConstants';

const PrivacyPolicy = () => {
	return (
		<LegalTemplate
			breadCrumbles={<BreadCrumbles currentPage={legalPage.PRIVACY_POLICY} />}
			termsAnchor={privacyAnchor}
			termsContent={privacyContent}
			termsParagraph={privacyParagraph}
			termsTitle={privacyTitle}
			termsLastUpdate={privacyLastUpdate}
			termsVersion={privacyVersion}
		/>
	);
};

export default PrivacyPolicy;
