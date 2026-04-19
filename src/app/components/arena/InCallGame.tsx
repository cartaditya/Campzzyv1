import React, { useState, useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";

type Square = "X" | "O" | null;

function checkWinner(squares: Square[]): Square {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

interface InCallGameProps {
  onGameEnd?: (result: "win" | "lose" | "draw") => void;
}

export function InCallGame({ onGameEnd }: InCallGameProps) {
  const [board, setBoard] = useState<Square[]>(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [scores, setScores] = useState({ you: 2, draws: 1, them: 1 });
  const reportedRef = useRef(false);

  const winner = checkWinner(board);
  const isDraw = !winner && board.every(Boolean);
  const gameOver = !!winner || isDraw;

  // Fire onGameEnd once when the game concludes
  useEffect(() => {
    if (!gameOver || reportedRef.current) return;
    reportedRef.current = true;

    if (winner === "X") {
      setScores((s) => ({ ...s, you: s.you + 1 }));
      onGameEnd?.("win");
    } else if (winner === "O") {
      setScores((s) => ({ ...s, them: s.them + 1 }));
      onGameEnd?.("lose");
    } else {
      setScores((s) => ({ ...s, draws: s.draws + 1 }));
      onGameEnd?.("draw");
    }
  }, [gameOver, winner, onGameEnd]);

  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    const next = [...board];
    next[i] = isX ? "X" : "O";
    setBoard(next);
    setIsX(!isX);
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsX(true);
    reportedRef.current = false;
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0d1117",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.25rem",
        padding: "1.5rem",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          background: "rgba(0,123,255,0.12)", border: "1px solid rgba(0,123,255,0.25)",
          borderRadius: "10px", padding: "0.3rem 0.75rem", marginBottom: "0.5rem",
        }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#007BFF", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            🎮 Tic-Tac-Toe · Live
          </span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.85)", fontWeight: 800, fontSize: "1rem", margin: 0 }}>
          {winner
            ? `${winner === "X" ? "You" : "Opponent"} Win! 🏆`
            : isDraw
            ? "It's a Draw! 🤝"
            : `${isX ? "Your" : "Opponent's"} Turn`}
        </p>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", margin: "0.2rem 0 0", fontWeight: 600 }}>
          You are <span style={{ color: "#007BFF" }}>X</span> · Opponent is <span style={{ color: "#FFC107" }}>O</span>
        </p>
      </div>

      {/* Board */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", maxWidth: "280px", width: "100%" }}>
        {board.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{
              aspectRatio: "1",
              borderRadius: "14px",
              border: `2px solid ${sq === "X" ? "rgba(0,123,255,0.4)" : sq === "O" ? "rgba(255,193,7,0.4)" : "rgba(255,255,255,0.07)"}`,
              background: sq === "X" ? "rgba(0,123,255,0.12)" : sq === "O" ? "rgba(255,193,7,0.08)" : "rgba(255,255,255,0.04)",
              cursor: sq || winner ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", fontWeight: 900,
              color: sq === "X" ? "#007BFF" : sq === "O" ? "#FFC107" : "transparent",
              transition: "all 0.15s",
              fontFamily: "inherit",
            }}
          >
            {sq || "·"}
          </button>
        ))}
      </div>

      {/* Reset */}
      <button
        onClick={reset}
        style={{
          display: "flex", alignItems: "center", gap: "0.4rem",
          padding: "0.5rem 1.25rem", borderRadius: "10px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.05)",
          color: "rgba(255,255,255,0.6)",
          fontSize: "0.8rem", fontWeight: 700, cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <RotateCcw size={13} /> New Game
      </button>

      {/* Score strip */}
      <div style={{
        display: "flex", gap: "1rem",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px", padding: "0.6rem 1.5rem",
      }}>
        {[
          { label: "You (X)", val: scores.you, color: "#007BFF" },
          { label: "Draws",   val: scores.draws, color: "#6B7280" },
          { label: "Them (O)", val: scores.them, color: "#FFC107" },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <p style={{ fontSize: "1.1rem", fontWeight: 900, color: s.color, margin: 0, lineHeight: 1 }}>{s.val}</p>
            <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0.2rem 0 0" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
