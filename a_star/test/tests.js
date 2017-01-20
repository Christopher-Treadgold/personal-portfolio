import aStar from "../a-star";
import generateMaze from "../generate-maze"
var assert = require("assert");

describe("generateMaze", function() {

  const testCases = [
    {x: 10, y: 10},         // Small x, y values
    {x: 100, y: 100},       // Slightly larger x, y values
    {x: 500, y: 100},       // Larger x than y
    {x: 100, y: 500},       // Larger y than x
    {x: 1000, y: 1000},     // Moderaty large x, y values
    // {x: 5000, y: 5000}      // Very large x, y values (SLOW)
  ]

  testCases.forEach( function({x, y}) {
    describe(`.call(null,${x},${y})`, function() {

      let maze = generateMaze( x, y ),
          properties = [ "maze", "start", "end" ];

      properties.forEach( function(property) {
        it(`should generate an object with the property: ${property}.`, function() {
          assert( maze.hasOwnProperty( property ),
                  `object did not have property: ${property}`);
        });
      });

      it(`should generate a start value that is an integer pair`, function() {
        let startX = maze.start[0];
        let startY = maze.start[1];
        assert( Number.isInteger( startX ) && Number.isInteger( startY ), 
                "expected integer pair, got: [${startX},${startY}]");
      });

      it(`should generate a end value that is an integer pair`, function() {
        let endX = maze.end[0];
        let endY = maze.end[1];
        assert( Number.isInteger( endX ) && Number.isInteger( endY ), 
                "expected integer pair, got: [${endX},${endY}]");
      });

      it(`should generate an array with length ${x}.`, function() {
        let mazeLength = maze.maze.length;
        assert.equal(x, mazeLength, "array length was ${maze.length}");
      });

      it(`should generate an array with elements of length ${y}.`, function() {
        let elementLength = maze.maze[0].length;
        assert.equal(y, elementLength, `array element length was ${maze.maze[0].length}`);
      });

      it("should generate an array maze where all elements are an equal length.", function() {
        let mazeArray = maze.maze;
        assert( mazeArray.every( function(__, i, arr) {
          return i > 0 ? arr[i].length == arr[i - 1].length : true
        }), "not all elements were an equal length");
      });

      it("should generate an array where some elements are truthy.", function() {
        let mazeArray = maze.maze;
        assert( mazeArray.some( function(arr) {
          return arr.some(function(el) {
            return el;
          });
        }), "no elements were truthy");
      });

      it(`should have a start value within [0, 0] to [${maze.maze.length - 1}, ${maze.maze[0].length - 1}].`, function() {
        let start = maze.start,
            maxX = maze.maze.length,
            maxY = maze.maze[0].length;
        assert( start[0] >= 0 && start[0] < maxX
             && start[1] >= 0 && start[1] < maxY,
             `start value was [${start[0]}, ${start[1]}]`);
      });

      it(`should have an end value within [0, 0] to [${maze.maze.length - 1}, ${maze.maze[0].length - 1}].`, function() {
        let end = maze.end,
            maxX = maze.maze.length,
            maxY = maze.maze[0].length;
        assert( end[0] >= 0 && end[0] < maxX
             && end[1] >= 0 && end[1] < maxY,
             `start value was [${end[0]}, ${end[1]}]`);
      });
    });
  });
});

describe("aStar", function() {

  const testCases = [
    {
      name: "2 x 2 maze with no walls",
      maze: {
        maze: [
          [0, 0],
          [0, 0]
        ],
        start: [0, 0],
        end: [1, 1]
      },
      expected: {
        path: {
          "1,1": true,
          "0,0": true
        }
      }
    },
    {
      name: "5 x 5 maze with no walls",
      maze: {
        maze: [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0]
        ],
        start: [0, 0],
        end: [4, 4]
      },
      expected: {
        path: {
          "4,4": true,
          "3,3": true,
          "2,2": true,
          "1,1": true,
          "0,0": true
        }
      }
    },
    {
      name: "5 x 5 maze with open wall in the middle",
      maze: {
        maze: [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 1, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0]
        ],
        start: [0, 0],
        end: [4, 4]
      },
      expected: {
        path: {
          "4,4": true,
          "3,3": true,
          "2,3": true,
          "1,2": true,
          "1,1": true,
          "0,0": true
        }
      }
    },
    {
      name: "10 x 10 maze with no obsticles",
      maze: {
        maze: [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        start: [0, 0],
        end: [9, 9]
      },
      expected: {
        path: {
          "9,9": true,
          "8,8": true,
          "7,7": true,
          "6,6": true,
          "5,5": true,
          "4,4": true,
          "3,3": true,
          "2,2": true,
          "1,1": true,
          "0,0": true
        }
      }
    },
    {
      name: "10 x 10 maze with some obsticles",
      maze: {
        maze: [
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 1, 1, 1, 1, 0],
          [0, 1, 0, 0, 1, 1, 0, 0, 0, 0],
          [0, 0, 0, 1, 1, 0, 1, 1, 1, 1],
          [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
          [0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
          [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
        ],
        start: [0, 0],
        end: [9, 9]
      },
      expected: {
        path: {
          "9,9": true,
          "8,8": true,
          "8,7": true,
          "7,6": true,
          "6,5": true,
          "5,5": true,
          "4,6": true,
          "4,7": true,
          "4,8": true,
          "3,9": true,
          "2,8": true,
          "2,7": true,
          "2,6": true,
          "2,5": true,
          "3,4": true,
          "4,3": true,
          "5,2": true,
          "5,1": true,
          "4,0": true,
          "3,0": true,
          "2,0": true,
          "1,0": true,
          "0,0": true
        }
      }
    },
    {
      name: "30 x 30 maze with lots of obsticles",
      maze: {
        maze: [
         [ 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0 ],
         [ 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1 ],
         [ 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1 ],
         [ 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0 ],
         [ 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0 ],
         [ 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1 ],
         [ 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1 ],
         [ 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1 ],
         [ 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0 ],
         [ 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0 ],
         [ 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0 ],
         [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0 ],
         [ 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0 ],
         [ 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1 ],
         [ 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0 ],
         [ 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0 ],
         [ 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
         [ 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1 ],
         [ 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0 ],
         [ 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1 ],
         [ 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1 ],
         [ 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0 ],
         [ 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1 ],
         [ 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1 ],
         [ 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1 ],
         [ 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0 ],
         [ 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0 ],
         [ 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1 ],
         [ 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0 ],
         [ 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1 ]
        ],
        start: [ 16, 5 ],
        end: [ 27, 17 ]
      },
      expected: {
        path: {
          "27,17": true,
          "26,17": true,
          "25,17": true,
          "24,16": true,
          "23,15": true,
          "22,14": true,
          "22,13": true,
          "21,12": true,
          "20,12": true,
          "19,11": true,
          "20,10": true,
          "20,9": true,
          "20,8": true,
          "19,7": true,
          "18,6": true,
          "17,6": true,
          "16,5": true
        }
      }
    }
  ];

  testCases.forEach( function({name, maze, expected}) {
    describe(`.call(null, *${name}* )`, function() {
      let iter = aStar( maze );
      let completedP = iter.runToCompletion();

      it("Should return an object with the shortest path from start to finish.", function() {
        return completedP
          .then( function(val) {
            console.log( "\t-------------------------------------------------" );
            console.log( "\tcalculated solution" );
            drawMaze( val );
            console.log( "\t-------------------------------------------------" );

            assert.deepEqual( val.path, expected.path );
          });
      });
    });
  });
});

function drawMaze(aStarOutput) {
  let maze = aStarOutput.maze;
  let start = aStarOutput.start;
  let end = aStarOutput.end;
  let path = aStarOutput.path;
  let openSet = aStarOutput.open;
  let closedSet = aStarOutput.closed;
  let success = aStarOutput.success;

  /* Draw the maze. * for a location on the solution path. S for the start.
     E for the end. */
  for ( let i = 0; i < maze.length; i++ ) {
    process.stdout.write( "\t" );
    for ( let j = 0; j < maze[0].length; j++ ) {
      if ( String(i) + "," + String(j) == String( start ) ) {
        process.stdout.write( "S " );
      }
      else if ( String(i) + "," + String(j) == String( end ) ) {
        process.stdout.write( "E " );
      }
      else if ( path[ String(i) + "," + String(j) ] === undefined ) {
        process.stdout.write( maze[i][j] ? "\u25A0 " : "  " );
      }
      else {
        process.stdout.write( "* " );
      }
    }
    console.log( "" );
  }
}