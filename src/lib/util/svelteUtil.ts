export function openLink(link: string) {
	browser.tabs.create({ url: link });
}
