import { useState } from "react";

function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{ background: highlight ? "magenta" : "white" }}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; ++i) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}

function Board({ squares, xIsNext, onPlay, statusCurrentMove }) {
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner[0];
  } else if (squares.includes(null)) {
    status = "Next player: " + (xIsNext ? "X" : "O");
  } else {
    status = "It is a draw!";
  }

  function handleSquareClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  return (
    <>
      <div className="status"> {statusCurrentMove} </div>
      <div className="status"> {status} </div>
      <div className="board-row">
        <Square
          value={squares[0]}
          onSquareClick={() => handleSquareClick(0)}
          highlight={winner && winner[1].includes(0)}
        />
        <Square
          value={squares[1]}
          onSquareClick={() => handleSquareClick(1)}
          highlight={winner && winner[1].includes(1)}
        />
        <Square
          value={squares[2]}
          onSquareClick={() => handleSquareClick(2)}
          highlight={winner && winner[1].includes(2)}
        />
      </div>
      <div className="board-row">
        <Square
          value={squares[3]}
          onSquareClick={() => handleSquareClick(3)}
          highlight={winner && winner[1].includes(3)}
        />
        <Square
          value={squares[4]}
          onSquareClick={() => handleSquareClick(4)}
          highlight={winner && winner[1].includes(4)}
        />
        <Square
          value={squares[5]}
          onSquareClick={() => handleSquareClick(5)}
          highlight={winner && winner[1].includes(5)}
        />
      </div>
      <div className="board-row">
        <Square
          value={squares[6]}
          onSquareClick={() => handleSquareClick(6)}
          highlight={winner && winner[1].includes(6)}
        />
        <Square
          value={squares[7]}
          onSquareClick={() => handleSquareClick(7)}
          highlight={winner && winner[1].includes(7)}
        />
        <Square
          value={squares[8]}
          onSquareClick={() => handleSquareClick(8)}
          highlight={winner && winner[1].includes(8)}
        />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  const [sortAsc, setSortAsc] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function getMoveCoord(move) {
    const moveSquares = history[move];
    const prevMoveSquares = history[move - 1];
    for (let i = 0; i < 9; ++i) {
      if (prevMoveSquares[i] === null && moveSquares[i]) {
        return "(" + (Math.floor(i / 3) + 1) + "," + ((i % 3) + 1) + ")";
      }
    }
    return "";
  }

  let moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move + getMoveCoord(move);
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if (!sortAsc) moves.reverse();

  const statusCurrentMove = "You are at move #" + currentMove;

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  let sortDescription;
  if (sortAsc) {
    sortDescription = "Sort history ascending";
  } else {
    sortDescription = "Sort history descending";
  }

  function handleSortAsc() {
    setSortAsc(!sortAsc);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={currentSquares}
          xIsNext={xIsNext}
          onPlay={handlePlay}
          statusCurrentMove={statusCurrentMove}
        />
      </div>
      <div className="game-info">
        <label class="switch">
          <input type="checkbox" onClick={handleSortAsc} />
          {sortDescription}
        </label>
        <ol reversed={!sortAsc}>{moves}</ol>
      </div>
    </div>
  );
}
