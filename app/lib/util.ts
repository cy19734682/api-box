/**
 * 格式化工具调用结果
 */
export async function copyTextToClipboard(text: string): Promise<void> {
	
	const fallbackCopyTextToClipboard = (text: string): void => {
		const textArea = document.createElement('textarea');
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.select();
		document.execCommand('copy');
		document.body.removeChild(textArea);
	};
	
	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(text);
		return;
	}
	try {
		await navigator.clipboard.writeText(text);
	}
	catch (err) {
		console.error('Clipboard write failed:', err);
		fallbackCopyTextToClipboard(text);
	}
}