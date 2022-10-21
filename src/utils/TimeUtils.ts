export namespace TimeUtils {
	
	export const secondsToFormattedTime = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds - hours * 3600) / 60);
		const secondsLeft = seconds - hours * 3600 - minutes * 60;
		
		let formattedTime = "";
		if (hours > 0) {
			formattedTime += hours + "h";
		}
		if (minutes > 0) {
			formattedTime += minutes + "m";
		}
		if (secondsLeft > 0) {
			formattedTime += secondsLeft + "s";
		}
		
		return formattedTime;
	}
}
