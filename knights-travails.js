function knightMoves(start, end) {
	let tree = new Tree(start);
	let path = tree.findPath(end);

	console.log(`You made it in ${path.length - 1} moves! Here's your path:`);
	path.forEach(coordinates => console.log(coordinates));
}

class Tree {
	root = null;

	constructor(startingCoordinates) {
		this.root = new Node(startingCoordinates);
		this.buildTree(this.root);
	}

	get root() {
		return this.root;
	}

	buildTree(root) {
		let discoveredNodes = [root];
		let visitedNodes = [];

		while (discoveredNodes.length > 0) {
			let node = discoveredNodes.shift();
			visitedNodes.push(node);
			
			let childrenData = this.#generateMoves(node.data);
			
			childrenData = this.#removeDuplicates(childrenData, visitedNodes);
			childrenData = this.#removeDuplicates(childrenData, discoveredNodes);
			
			childrenData.forEach(coordinates => {
				node.appendChild(new Node(coordinates));
			});

			discoveredNodes = [...discoveredNodes, ...node.getChildren()];

			let discoveredNodesArray = [];
			discoveredNodes.forEach(node => discoveredNodesArray.push(node.data));
			// console.log(discoveredNodesArray);
		}

		return root;
	}

	findPath(targetCoordinates, root = this.root) {
		if (JSON.stringify(root.data) === JSON.stringify(targetCoordinates)) return [root.data];

		let path = null;

		root.getChildren().forEach(child => {
			if (path === null)
				path = this.findPath(targetCoordinates, child);
		});

		return path !== null ? [root.data, ...path] : null;
	}

	#removeDuplicates(array, valuesToCheck) {
		valuesToCheck.forEach(node => {
			let duplicates = array.filter(coordinates => JSON.stringify(coordinates) === JSON.stringify(node.data));
			if (duplicates.length > 0) {
				duplicates.forEach(coordinates => {
					let index = array.indexOf(coordinates);
					array.splice(index, 1);
				});
			}
		});

		return array;
	}

	#generateMoves(coordinates) {
		let moves = [];

		const possibleMoves = [
			[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[-1,2],[1,-2],[-1,-2]
		];

		possibleMoves.forEach(possibleMove => {
			let move = [];
			move[0] = coordinates[0] + possibleMove[0];
			move[1] = coordinates[1] + possibleMove[1];

			if (this.#isValidMove(move))
				moves.push(move);
		});

		return moves;
	}

	#isValidMove(coordinates) {
		return (coordinates[0] < 0 || coordinates[0] > 7 ||
			coordinates[1] < 0 || coordinates[1] > 7) ?
			false : true;
	}
}

class Node {
	// properties
	data = undefined;
	children = [];

	// constructor
	constructor(data) {
		this.data = data;
	}

	// getters and setters
	get data() {
		return this.data;
	}

	get isLeaf() {
		return this.children.length > 0 ? false : true;
	}

	set data(data) {
		this.data = data;
	}

	// methods
	appendChild(node) {
		if (!node instanceof Node)
			throw new Error(`${node} is not a instance of Node`);

		this.children.push(node);
	}

	removeChild(node) {
		if (!node instanceof Node)
			throw new Error(`${node} is not a instance of Node`);

		let index = this.children.indexOf(node);

		if (index <= 0) return;
		this.children.splice(index, 1);
	}

	getChildren() {
		return this.children;
	}
}

knightMoves([0,0],[3,3]);