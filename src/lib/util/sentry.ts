import * as Sentry from "@sentry/browser";

export function initSentry() {
    Sentry.init({
		dsn: "https://a35e0b6b92b50892d9daa4daa2992db2@o4506512325738496.ingest.sentry.io/4506516317536256",
		release: `betterbuff@${browser?.runtime?.getManifest()?.version ?? '0.0.0'}`,
		integrations: [
		  new Sentry.BrowserTracing({
			// Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
			tracePropagationTargets: ["localhost", /^https:\/\/*\.rums\.dev/],
		  }),
		  new Sentry.Replay({
			maskAllText: false,
			blockAllMedia: false,
		  }),
		],
		// Performance Monitoring
		tracesSampleRate: 1.0,
		// Session Replay
		replaysSessionSampleRate: 0.2,
		replaysOnErrorSampleRate: 1.0,
	  });
}
