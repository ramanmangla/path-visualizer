// Graph Class
class Graph {
	constructor(vertices, edges, adjacencyList){
		this.vertices = vertices;
		this.edges = edges;
		this.adjacencyList = adjacencyList;
	}
}

// Vertex Class
class Vertex {
	constructor(num, distance, color, parent, isWall){
		this.num = num;
		this.distance = distance;
		this.color = color;
		this.parent = parent;
		this.isWall = isWall;
	}
}

// A Min PriorityQueue Class
class PriorityQueue {
	constructor(){
		// Array used to represent the queue
		this.baseArray = [];
	}

	getMinimum(){
		return baseArray[0];
	}

	extractMin(){
		if(this.baseArray.length >= 1){
			const min = this.baseArray[0];
			this.baseArray[0] = this.baseArray[this.baseArray.length - 1];
			heapSize -= 1;
			// TODO: Implement minHeapify
			minHeapify(this.baseArray, 0);
			return min;
		}
	}

	decreaseKey(index, key){
		if(key <= this.baseArray[key].distance){
			this.baseArray[index].distance = key;
			let parentIndex = Math.floor(index / 2);
			while(index > 0 && this.baseArray[parentIndex] > A[index]){
				// Swap A[index] with A[parentIndex]
				let temp = A[index];
				A[index] = A[parentIndex];
				A[parentIndex] = temp;
				// Set index to parentIndex
				index = parentIndex;
				// Recalculate parentIndex
				parentIndex = Math.floor(index / 2);
			}
		}
	}

	insert(vertex){
		this.baseArray.push(vertex);
		const actualKey = vertex.distance;
		/* Set vertex distnace to the maximum to ensure key actually decreases
		 See implementation of decreaseKey for details */
		vertex.distance = Number.MAX_SAFE_INTEGER;
		// Decrease this vertex's key to actual key
		this.decreaseKey(this.baseArray.length - 1, actualKey);
	}
}