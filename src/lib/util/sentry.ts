import * as Sentry from "@sentry/browser";

export function initSentry() {
    Sentry.init({
		dsn: "https://a35e0b6b92b50892d9daa4daa2992db2@o4506512325738496.ingest.sentry.io/4506516317536256",
		release: `betterbuff@${browser?.runtime?.getManifest()?.version ?? '0.0.0'}`,
		integrations: [
		  new Sentry.BrowserTracing(),
		  new Sentry.Replay({
			maskAllText: false,
			blockAllMedia: false,
		  }),
		],
		// Performance Monitoring
		tracesSampleRate: 0.2,
		tracePropagationTargets: ["localhost", /^https:\/\/*\.rums\.dev/],
		// Session Replay
		replaysSessionSampleRate: 0,
		replaysOnErrorSampleRate: 1,
	  });
}
