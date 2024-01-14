import * as Sentry from "@sentry/browser";

export function initSentry() {
    Sentry.init({
		dsn: "https://a35e0b6b92b50892d9daa4daa2992db2@o4506512325738496.ingest.sentry.io/4506516317536256",
		release: `betterbuff@${browser?.runtime?.getManifest()?.version ?? '0.0.0'}`,
		integrations: [
		  new Sentry.BrowserTracing({
			// Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
			tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
		  }),
		  new Sentry.Replay({
			maskAllText: false,
			blockAllMedia: false,
		  }),
		],
		// Performance Monitoring
		tracesSampleRate: 1.0, //  Capture 100% of the transactions
		// Session Replay
		replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
		replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
	  });
}
