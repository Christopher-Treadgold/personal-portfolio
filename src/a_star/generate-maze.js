export default function generateMaze(x, y) {
  const maze = Array.from( Array(x) ).map( function() {
    return Array.from( Array(y) ).map( function() {
      return Math.random() < 0.5 ? 1 : 0;
    });
  });
  const start = [Math.floor( ran(0, x) ), Math.floor( ran(0, y) )];
  const end = [Math.floor( ran(0, x) ), Math.floor( ran(0, y) )];

  if ( maze[ start[0] ][ start[1] ] ) maze[ start[0] ][ start[1] ] = 0;
  if ( maze[ end[0] ][ end[1] ] ) maze[ end[0] ][ end[1] ] = 0;

  return { maze, start, end };

  function ran(min, max) {
    return Math.random() * (max - min) + min;
  }
};