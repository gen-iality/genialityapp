export const deviceOrientation = () => {
	if (!window.screen.orientation) return 'VERTICAL';
	const deviceOrientation = window.screen.orientation.type;
	switch (deviceOrientation) {
		case 'landscape-primary':
		case 'landscape-secondary':
			return 'HORIZONTAL';
		case 'portrait-primary':
		case 'portrait-secondary':
			return 'VERTICAL';
		default:
			return 'VERTICAL';
	}
};
