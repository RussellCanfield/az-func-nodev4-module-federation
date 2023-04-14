import React, { Suspense, lazy } from "react";

// @ts-ignore
const Host = lazy(() => import("host/Provider"));

export default function Consumer() {
	return (
		<div>
			Remote test!
			<Suspense fallback="Loading Host">
				<Host />
			</Suspense>
		</div>
	);
}
