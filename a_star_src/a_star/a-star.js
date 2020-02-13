function *aStarGen(maze) {
  let yobro = 0;
  // Extract data from the maze object
  let nodeMaze = nodesFromMaze( maze.maze, maze.start );
  let startNode = nodeMaze[ maze.start[0] ][ maze.start[1] ];
  let endNode = nodeMaze[ maze.end[0] ][ maze.end[1] ];

  calculateNeighbors(nodeMaze);

  // Already evaluated nodes
  let closedSet = {};
  // Discovered nodes that have been evaluated at least once
  let openSet = [ startNode ];

  // Initialise the g and f scores of the starting node
  startNode.gScore = 0;
  startNode.fScore = calculateHeuristic( startNode );

  while ( openSet.length > 0 ) {
    let currentNode = removeLowest( openSet );

    if ( currentNode == endNode ) {
      return {
        maze: maze.maze,
        start: String( startNode ),
        end: String( endNode ),
        path: reconstructPath( endNode ),
        closed: formatClosedSet(),
        open: formatOpenSet(),
        success: true
      };
    }

    closedSet[currentNode] = true;

    for ( let neighbor of currentNode.neighbors ) {
      if ( closedSet[neighbor] ) continue;

      let tentativeGScore = currentNode.gScore + distanceBetween( currentNode, neighbor );

      if ( openSet.indexOf( neighbor ) == -1 ) {
        openSet.push( neighbor );
      }
      else if ( tentativeGScore >= neighbor.gScore ) {
        continue;
      }

      // Best path up to now, record that bad boy
      neighbor.cameFrom = currentNode;
      neighbor.gScore = tentativeGScore;
      neighbor.fScore = neighbor.gScore + calculateHeuristic( neighbor );
    }

    yield {
      maze: maze.maze,
      start: String( startNode ),
      end: String( endNode ),
      path: reconstructPath( currentNode ),
      closed: formatClosedSet(),
      open: formatOpenSet()
    };
  }

  // Path from start to end was not found
  return {
    maze: maze.maze,
    start: String( startNode ),
    end: String( endNode ),
    path: reconstructPath( endNode ),
    closed: formatClosedSet(),
    open: formatOpenSet(),
    success: false
  };
  
  /////////////////////////////////////////////////////////////////////
  //Helper functions///////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////

  /* 
  * Generates an array from the maze where each element is an object representing
  * a node.
  */
  function nodesFromMaze(maze, start) {
    return maze.map( function(row, x) {
      return row.map( function(ele, y) {
        if ( ele ) return { wall: true };

        return {
          x,
          y,
          gScore: Infinity,
          fScore: Infinity,
          wall: false,
          neighbors: [],
          cameFrom: undefined,
          toString: function () {
            return String( x ) + "," + String( y );
          }
        };
      });
    });
  }

  /*
  * Calculates the distance between two nodes.
  */
  function distanceBetween(nodeA, nodeB) {
    let xDiff = Math.abs( nodeA.x - nodeB.x );
    let yDiff = Math.abs( nodeA.y - nodeB.y );
    return Math.hypot( xDiff, yDiff );
  }

  /*
  * Calculates the heuristic for a given node where the heuristic is the
  * distance in euclideon space between the node and the end node.
  */
  function calculateHeuristic(node) {
    return distanceBetween( node, endNode );
  }

  /*
  * Calculated the neighbors of every node in the maze, excludes walls
  * and out of bounds.
  */
  function calculateNeighbors(maze) {
    maze.forEach( function(row, x) {
      row.forEach( function(ele, y) {
        if ( ele.wall ) return;

        for ( let i = x - 1; i <= x + 1; i++ ) {
          for (let j = y - 1; j <= y + 1; j++) {
            if (i == x && j == y) continue;

            if ( inBounds(i, j) ) {
              let neighbor = maze[i][j];
              if ( !neighbor.wall ) ele.neighbors.push( neighbor );
            }
          }
        }

        function inBounds(x, y) {
          return !!(x >= 0 && x < maze.length
                 && y >= 0 && y < maze[0].length)
        }
      });
    });
  }

  /*
  * Removes the element with the lowest f value from the array and returns it.
  */
  function removeLowest(arr) {
    let lowest =  arr.reduce( function(acc, curr) {
      return curr.fScore < acc.fScore ? curr : acc;
    }, { fScore: Infinity });

    arr.splice( arr.indexOf(lowest), 1);

    return lowest;
  }

  function reconstructPath( node ) {
    let path = {};
    let currentNode = node;

    while ( currentNode ) {
      path[currentNode] = true;
      currentNode = currentNode.cameFrom;
    }

    return path;
  }

  function formatClosedSet() {

  }

  function formatOpenSet() {

  }
}

export default function aStar(maze) {
  return Object.assign( aStarGen(maze), { runToCompletion });

  /*
  * Asynchronously runs the generator till it completes.
  */
  function runToCompletion() {
    let iter = this;
    let next;

    return Promise.resolve()
      .then( function () {
        next = iter.next();

        while ( !next.done ) {
          next = iter.next();
        }

        return next.value;
      });
   }
};