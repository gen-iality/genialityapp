const BOOLEAN_IN_STRING = {
	false: false,
	true: true,
};

export const parseStringBoolean = (value: string | boolean) => {
	if (typeof value === 'string') {
		if (value === 'true' || value === 'false') {
			return BOOLEAN_IN_STRING[value];
		} else {
			return false;
		}
	} else {
		return value;
	}
};