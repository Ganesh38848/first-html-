import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeGame, setActiveGame] = useState(null);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  // Removed unused canvasRef variable

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      navigate('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch dashboard data
    axios.get('http://localhost:5000/api/auth/dashboard', {
      headers: { Authorization: token }
    })
    .then(res => setUser(prev => ({ ...prev, ...res.data })))
    .catch(err => { 
      alert('Session expired');
      navigate('/login');
    });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Games Configuration
  const games = [
    {
      id: 'memory',
      name: 'Memory Cards',
      icon: '🎴',
      description: 'Test your memory with matching cards',
      color: '#ff6b6b'
    },
    {
      id: 'tic-tac-toe',
      name: 'Tic Tac Toe',
      icon: '⭕',
      description: 'Classic X and O game',
      color: '#4ecdc4'
    },
    {
      id: 'snake',
      name: 'Snake Game',
      icon: '🐍',
      description: 'Classic snake adventure',
      color: '#ffe66d'
    },
    {
      id: 'dice',
      name: 'Dice Roll',
      icon: '🎲',
      description: 'Roll the dice and test your luck',
      color: '#786fa6'
    },
    {
      id: 'quiz',
      name: 'Quick Quiz',
      icon: '❓',
      description: 'Challenge your knowledge',
      color: '#ff9ff3'
    },
    {
      id: 'puzzle',
      name: 'Number Puzzle',
      icon: '🧩',
      description: 'Slide numbers to solve the puzzle',
      color: '#54a0ff'
    }
  ];

  const renderGame = () => {
    switch(activeGame) {
      case 'memory':
        return <MemoryGame onBack={() => setActiveGame(null)} onScore={setScore} />;
      case 'tic-tac-toe':
        return <TicTacToe onBack={() => setActiveGame(null)} onScore={setScore} />;
      case 'snake':
        return <SnakeGame onBack={() => setActiveGame(null)} onScore={setScore} />;
      case 'dice':
        return <DiceGame onBack={() => setActiveGame(null)} onScore={setScore} />;
      case 'quiz':
        return <QuizGame onBack={() => setActiveGame(null)} onScore={setScore} />;
      case 'puzzle':
        return <PuzzleGame onBack={() => setActiveGame(null)} onScore={setScore} />;
      default:
        return <GameSelection games={games} setActiveGame={setActiveGame} user={user} score={score} logout={logout} />;
    }
  };

  if (!user) {
    return <div className="loading-3d">Loading...</div>;
  }

  return renderGame();
}

// Game Selection Component (Main Dashboard)
function GameSelection({ games, setActiveGame, user, score, logout }) {
  return (
    <div className="dashboard-container">
      {/* Animated Background */}
      <div className="dashboard-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      {/* Header */}
      <div className="dashboard-header">
        <div className="user-info-3d">
          <div className="user-avatar">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <h2 className="welcome-text">Welcome, {user.name}!</h2>
            <p className="user-email">{user.email}</p>
          </div>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <div className="stat-value">{score}</div>
              <div className="stat-label">Total Score</div>
            </div>
          </div>
          <button className="logout-btn-3d" onClick={logout}>
            <span>Logout</span>
            <div className="btn-glow"></div>
          </button>
        </div>
      </div>

      {/* Games Grid */}
      <div className="games-section">
        <h3 className="section-title">🎮 Choose Your Game</h3>
        <div className="games-grid">
          {games.map((game, index) => (
            <div 
              key={game.id}
              className="game-card-3d"
              style={{ '--card-color': game.color }}
              onClick={() => setActiveGame(game.id)}
            >
              <div className="game-card-inner">
                <div className="game-icon">{game.icon}</div>
                <h4 className="game-name">{game.name}</h4>
                <p className="game-desc">{game.description}</p>
                <div className="game-hover-effect"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <h3 className="section-title">📈 Your Activity</h3>
        <div className="activity-cards">
          <div className="activity-card">
            <div className="activity-icon">🏆</div>
            <div className="activity-info">
              <div className="activity-title">Games Played</div>
              <div className="activity-value">12</div>
            </div>
          </div>
          <div className="activity-card">
            <div className="activity-icon">⭐</div>
            <div className="activity-info">
              <div className="activity-title">High Score</div>
              <div className="activity-value">1,250</div>
            </div>
          </div>
          <div className="activity-card">
            <div className="activity-icon">⚡</div>
            <div className="activity-info">
              <div className="activity-title">Current Streak</div>
              <div className="activity-value">3 days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Memory Card Game Component
function MemoryGame({ onBack, onScore }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const symbols = ['🎮', '⭐', '🎯', '🏆', '🎨', '🚀'];
    const gameCards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, id) => ({ id, symbol }));
    
    setCards(gameCards);
    setFlipped([]);
    setSolved([]);
  };

  const handleClick = (id) => {
    if (disabled || flipped.includes(id) || solved.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const [first, second] = newFlipped;
      
      if (cards[first].symbol === cards[second].symbol) {
        setSolved([...solved, first, second]);
        setFlipped([]);
        setDisabled(false);
        onScore(prev => prev + 10);
        
        if (solved.length + 2 === cards.length) {
          setTimeout(() => {
            alert('🎉 You won! +50 points');
            onScore(prev => prev + 50);
          }, 500);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>🎴 Memory Cards</h2>
        <button className="restart-btn" onClick={initializeGame}>🔄 Restart</button>
      </div>
      
      <div className="memory-grid">
        {cards.map(card => (
          <div
            key={card.id}
            className={`memory-card ${
              flipped.includes(card.id) || solved.includes(card.id) ? 'flipped' : ''
            }`}
            onClick={() => handleClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{card.symbol}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tic Tac Toe Game Component
function TicTacToe({ onBack, onScore }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const calculateWinner = (squares) => {
    const lines = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    
    for (let line of lines) {
      const [a,b,c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (board[i] || calculateWinner(board)) return;
    
    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(cell => cell !== null);

  useEffect(() => {
    if (winner) {
      onScore(prev => prev + 20);
      setTimeout(() => alert(`🎉 ${winner} wins! +20 points`), 100);
    } else if (isDraw) {
      onScore(prev => prev + 5);
    }
  }, [winner, isDraw, onScore]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>⭕ Tic Tac Toe</h2>
        <button className="restart-btn" onClick={resetGame}>🔄 Restart</button>
      </div>

      <div className="tic-tac-toe-board">
        {board.map((cell, i) => (
          <button
            key={i}
            className={`tic-tac-toe-cell ${cell}`}
            onClick={() => handleClick(i)}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="game-status">
        {winner ? `Winner: ${winner}` : 
         isDraw ? "It's a draw!" : 
         `Next player: ${isXNext ? 'X' : 'O'}`}
      </div>
    </div>
  );
}

// Snake Game Component
function SnakeGame({ onBack, onScore }) {
  const [snake, setSnake] = useState([{ x: 8, y: 8 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch(e.key) {
        case 'ArrowUp': setDirection('UP'); break;
        case 'ArrowDown': setDirection('DOWN'); break;
        case 'ArrowLeft': setDirection('LEFT'); break;
        case 'ArrowRight': setDirection('RIGHT'); break;
        default:
          // Handle other keys or do nothing
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setSnake(prevSnake => {
        const head = {...prevSnake[0]};
        
        switch(direction) {
          case 'UP': head.y--; break;
          case 'DOWN': head.y++; break;
          case 'LEFT': head.x--; break;
          case 'RIGHT': head.x++; break;
          default:
            // Default case for direction
            break;
        }

        // Check collision with walls
        if (head.x < 0 || head.x >= 15 || head.y < 0 || head.y >= 15) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];
        
        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * 15),
            y: Math.floor(Math.random() * 15)
          });
          setScore(prev => prev + 10);
          onScore(prev => prev + 10);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, onScore]);

  const resetGame = () => {
    setSnake([{ x: 8, y: 8 }]);
    setFood({ x: 5, y: 5 });
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>🐍 Snake Game</h2>
        <div className="snake-score">Score: {score}</div>
        <button className="restart-btn" onClick={resetGame}>🔄 Restart</button>
      </div>

      <div className="snake-board">
        {Array.from({ length: 15 }).map((_, y) => (
          <div key={y} className="snake-row">
            {Array.from({ length: 15 }).map((_, x) => {
              const isSnake = snake.some(segment => segment.x === x && segment.y === y);
              const isFood = food.x === x && food.y === y;
              const isHead = snake[0].x === x && snake[0].y === y;

              return (
                <div
                  key={x}
                  className={`snake-cell ${
                    isHead ? 'snake-head' : 
                    isSnake ? 'snake-body' : 
                    isFood ? 'snake-food' : ''
                  } ${gameOver ? 'game-over' : ''}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="game-over-message">
          <h3>Game Over! Final Score: {score}</h3>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}

      <div className="game-instructions">
        Use arrow keys to control the snake
      </div>
    </div>
  );
}

// Dice Game Component
function DiceGame({ onBack, onScore }) {
  const [dice, setDice] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [total, setTotal] = useState(0);

  const rollDice = () => {
    if (rolling) return;
    
    setRolling(true);
    let rolls = 0;
    const rollInterval = setInterval(() => {
      setDice(Math.floor(Math.random() * 6) + 1);
      rolls++;
      
      if (rolls > 10) {
        clearInterval(rollInterval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDice(finalRoll);
        setRolling(false);
        setTotal(prev => {
          const newTotal = prev + finalRoll;
          if (finalRoll === 6) {
            onScore(prevScore => prevScore + 10);
          }
          return newTotal;
        });
      }
    }, 100);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>🎲 Dice Roll</h2>
        <div className="dice-total">Total: {total}</div>
      </div>

      <div className="dice-game">
        <div className={`dice ${rolling ? 'rolling' : ''}`} onClick={rollDice}>
          <div className={`dice-face face-${dice}`}>
            {Array.from({ length: dice }).map((_, i) => (
              <div key={i} className="dice-dot"></div>
            ))}
          </div>
        </div>
        <button className="roll-btn" onClick={rollDice} disabled={rolling}>
          {rolling ? 'Rolling...' : 'Roll Dice'}
        </button>
      </div>

      <div className="dice-rules">
        <p>🎯 Roll a 6 to earn 10 points!</p>
      </div>
    </div>
  );
}

// Quiz Game Component
function QuizGame({ onBack, onScore }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      question: "What is React?",
      options: ["A JavaScript library", "A programming language", "A database", "An operating system"],
      correct: 0
    },
    {
      question: "Which company created React?",
      options: ["Google", "Facebook", "Microsoft", "Apple"],
      correct: 1
    },
    {
      question: "What is JSX?",
      options: ["A database", "A syntax extension for JavaScript", "A CSS framework", "A testing tool"],
      correct: 1
    }
  ];

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === questions[currentQuestion].correct) {
      setScore(score + 10);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
      onScore(prev => prev + score + (selectedIndex === questions[currentQuestion].correct ? 10 : 0));
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="game-container">
        <div className="game-header">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <h2>❓ Quick Quiz</h2>
        </div>
        <div className="quiz-result">
          <h3>Quiz Completed! 🎉</h3>
          <p>Your score: {score}/{questions.length * 10}</p>
          <button onClick={restartQuiz}>Play Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>❓ Quick Quiz</h2>
        <div className="quiz-score">Score: {score}</div>
      </div>

      <div className="quiz-game">
        <div className="quiz-progress">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className="quiz-question">
          <h3>{questions[currentQuestion].question}</h3>
        </div>
        <div className="quiz-options">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              className="quiz-option"
              onClick={() => handleAnswer(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Puzzle Game Component
function PuzzleGame({ onBack, onScore }) {
  const [tiles, setTiles] = useState([]);
  const [emptyIndex, setEmptyIndex] = useState(8);

  useEffect(() => {
    shuffleTiles();
  }, []);

  const shuffleTiles = () => {
    const numbers = [1,2,3,4,5,6,7,8,null];
    const shuffled = [...numbers].sort(() => Math.random() - 0.5);
    setTiles(shuffled);
    setEmptyIndex(shuffled.indexOf(null));
  };

  const moveTile = (index) => {
    if (isAdjacent(index, emptyIndex)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setEmptyIndex(index);

      // Check if solved
      if (isSolved(newTiles)) {
        onScore(prev => prev + 30);
        setTimeout(() => alert('🎉 Puzzle Solved! +30 points'), 100);
      }
    }
  };

  const isAdjacent = (a, b) => {
    const rowA = Math.floor(a / 3);
    const colA = a % 3;
    const rowB = Math.floor(b / 3);
    const colB = b % 3;
    
    return (Math.abs(rowA - rowB) === 1 && colA === colB) || 
           (Math.abs(colA - colB) === 1 && rowA === rowB);
  };

  const isSolved = (tileArray) => {
    for (let i = 0; i < 8; i++) {
      if (tileArray[i] !== i + 1) return false;
    }
    return true;
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>🧩 Number Puzzle</h2>
        <button className="restart-btn" onClick={shuffleTiles}>🔄 Shuffle</button>
      </div>

      <div className="puzzle-game">
        <div className="puzzle-board">
          {tiles.map((tile, index) => (
            <div
              key={index}
              className={`puzzle-tile ${tile === null ? 'empty' : ''}`}
              onClick={() => moveTile(index)}
            >
              {tile}
            </div>
          ))}
        </div>
        <div className="puzzle-instructions">
          Slide tiles to arrange numbers 1-8 in order
        </div>
      </div>
    </div>
  );
}

export default Dashboard;