import React, { useEffect, useState } from 'react';
import TrmApi from 'trm-api';

const TRM_APP_TOKEN = process.env.VITE_TRM_APP_TOKEN;

export default function useTrm() {
    const [trm, setTrm] = useState(1);

	useEffect(() => {
		const trmApi = new TrmApi(TRM_APP_TOKEN);
		trmApi
			.latest()
			.then((data: any) => setTrm(Number(data.valor)))
			.catch((error: any) => console.error('TRM Error:', { error }));
	}, []);

	return { trm };
}
