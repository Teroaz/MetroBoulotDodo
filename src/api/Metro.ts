import Station from "./Station";
import Path from "./Path";
import Line from "./Line";

export namespace Metro {
	
	export const lines: Line[] = [];
	export const stations: Station[] = [];
	export const paths: Path[] = [];
	
	export const getMatrixAdjacency = (): number[][] => {
		// Initialisation de la matrice
		const matrix = new Array(stations.length).fill(0).map(() => new Array(stations.length).fill(0));
		
		for (let i = 0; i < stations.length; i++) {
			for (let j = 0; j < stations.length; j++) {
				// On s'occupe de traiter la partie inférieure de la diagonale en même temps que la partie supérieure
				if (i > j) continue;
				const path = paths.find(path => path.info.first.info.id === stations[i].info.id && path.info.second.info.id === stations[j].info.id);
				if (path && path.info.time > 0) {
					matrix[i][j] = path.info.time;
					matrix[j][i] = path.info.time;
				}
			}
		}
		
		return matrix;
	}
	
	export const dijkstra = (start: Station, end: Station): Path[] => {
		if (start.info.id === end.info.id) return [];
		
		const matrix = getMatrixAdjacency();
		
		// Pour chaque sommet, on stocke la distance entre le sommet de départ et le sommet actuel
		const distances = new Array(stations.length).fill(Number.MAX_SAFE_INTEGER);
		distances[start.info.id] = 0;
		
		const visited = new Array(stations.length).fill(false);
		const previous = new Array(stations.length).fill(-1);
		
		let current = start.info.id;
		
		// Tant que nous ne sommes pas arrivés au sommet de fin
		while (current !== end.info.id) {
			visited[current] = true;
			
			// Pour chaque sommet présent dans le graphe
			for (let i = 0; i < stations.length; i++) {
				// S'il existe une arête entre le sommet actuel et le sommet i
				if (matrix[current][i] > 0) {
					// On calcule la distance entre la somme des distances jusqu'à présent et le sommet i
					const newDistance = distances[current] + matrix[current][i];
					// Si cette distance est plus petite que la distance actuelle entre le sommet de départ et le sommet i
					if (newDistance < distances[i]) {
						// On met à jour la distance entre le sommet de départ et le sommet i
						distances[i] = newDistance;
						previous[i] = current;
					}
				}
			}
			
			// On récupère le sommet le plus proche du sommet actuel et on le définit comme sommet actuel
			let minDistance = Number.MAX_SAFE_INTEGER;
			let minIndex = -1;
			for (let i = 0; i < stations.length; i++) {
				if (!visited[i] && distances[i] < minDistance) {
					minDistance = distances[i];
					minIndex = i;
				}
			}
			
			current = minIndex;
		}
		
		
		const path: Path[] = [];
		
		let currentStation = end.info.id;
		
		// On remonte le chemin en partant du sommet de fin jusqu'au sommet de départ
		while (currentStation !== start.info.id) {
			const previousStation = previous[currentStation];
			// Comme un chemin est bidiirectionnel, on doit trouver le chemin dans les deux sens (start -> end et end -> start) (graphe non orienté)
			const path1 = paths.find(path => path.info.first.info.id === currentStation && path.info.second.info.id === previousStation);
			const path2 = paths.find(path => path.info.first.info.id === previousStation && path.info.second.info.id === currentStation);
			// On ajoute le chemin trouvé au chemin final
			if (path1 === path2) continue;
			if (path1) path.push(path1);
			if (path2) path.push(path2);
			currentStation = previousStation;
		}
		
		return path.reverse();
	}
	
	export const kruskal = (): Path[] => {
		const pathsCopy = [...paths, ...paths.map(path => new Path({first: path.info.second, second: path.info.first, time: path.info.time}))];
		
		pathsCopy.sort((a, b) => a.info.time - b.info.time);
		
		const tree: Path[] = [];
		
		const find = (station: Station, trees: Station[][]): Station[] => {
			for (let i = 0; i < trees.length; i++) {
				if (trees[i].find(s => s.info.id === station.info.id)) return trees[i];
			}
			return [];
		}
		
		const trees: Station[][] = [];
		
		for (let i = 0; i < pathsCopy.length; i++) {
			const path = pathsCopy[i];
			const firstTree = find(path.info.first, trees);
			const secondTree = find(path.info.second, trees);
			
			if (firstTree.length === 0 && secondTree.length === 0) {
				trees.push([path.info.first, path.info.second]);
				tree.push(path);
			} else if (firstTree.length === 0) {
				secondTree.push(path.info.first);
				tree.push(path);
			} else if (secondTree.length === 0) {
				firstTree.push(path.info.second);
				tree.push(path);
			} else if (firstTree !== secondTree) {
				trees.push([...firstTree, ...secondTree]);
				tree.push(path);
			}
		}
		return tree;
		
	}
}
