import LegalTemplate from '../LegalTemplate'
import BreadCrumbles from '../BreadCrumbles'
import { legalPage } from '../constant'
import { privacyAnchor, privacyContent, privacyParagraph, privacyTitle } from './constants'

const PrivacyPolicy = () => {
	return (
		<LegalTemplate
			breadCrumbles={<BreadCrumbles currentPage={legalPage.PRIVACY_POLICY} />}
			termsAnchor={privacyAnchor}
			termsContent={privacyContent}
			termsParagraph={privacyParagraph}
			termsTitle={privacyTitle}
		/>
	)
}

export default PrivacyPolicy