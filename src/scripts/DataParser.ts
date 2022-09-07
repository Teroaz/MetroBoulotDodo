import metro from '../metro.txt';

export namespace DataParser {
	
	export const extractDatas = () => {
		metro.split("\n").forEach((line) => {
			console.log(line);
		})
	}
	
}
