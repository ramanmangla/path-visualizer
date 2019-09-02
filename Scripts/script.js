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
	/*
		Initialzes vertex number 'num'.
		Initially, all vertices are colored "white", have no parent, and are not walls
		They are also "infinitley" away from the source, as they haven't been discovered
	*/
	constructor(num){
		this.num = num;
		// All vertices are 
		this.distance = Number.MAX_SAFE_INTEGER;
		// Initially, all vertices are white
		this.color = 'w';
		this.parent = null;
		this.isWall = false;
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

	minHeapify(index){
		// Get the index of the left and right child of index node
		const left = 2*index + 1;
		const right = 2*index + 2;
		let smallest = 0;

		/*
			Figure out who the smallest is among:
			baseArray[left], baseArray[right], baseArray[index]
		*/
		if(left <= this.baseArray.length && 
			this.baseArray[left] < this.baseArray[index]){
			smallest = left;
		}else{
			smallest = index;
		}

		if(right <= this.baseArray.length && 
			this.baseArray[right] < this.baseArray[smallest]){
			smallest = right;
		}

		/*
			If baseArray[index] wasn't smallest, swap it with the 
			smallest index. Then, minHeapify at smallest index
		*/
		if(smallest != index){
			const temp = this.baseArray[index];
			this.baseArray[index] = this.baseArray[smallest];
			this.baseArray[smallest] = temp;
			this.minHeapify(smallest);
		}
	}

	extractMin(){
		if(this.baseArray.length >= 1){
			const min = this.baseArray[0];
			this.baseArray[0] = this.baseArray[this.baseArray.length - 1];
			// Remove the last element.
			this.baseArray.pop();
			this.minHeapify(0);
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