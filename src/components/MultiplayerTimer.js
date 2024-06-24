import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, UserPlus, UserMinus, ArrowLeftRight, SkipForward, Undo } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { VisuallyHidden } from './ui/visually-hidden';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { Alert } from './ui/alert';
import CustomAlertDialog from './ui/custom-alert-dialog';

const MultiplayerTimer = () => {
  const colors = {
    sage: '#94A3B8',
    lavender: '#A78BFA',
    peach: '#FCA5A5',
    mint: '#86EFAC',
    sky: '#7DD3FC',
    coral: '#FDA4AF'
  };

  const [players, setPlayers] = useState([
    { name: 'Player 1', time: 60, initialTime: 60, isActive: false, color: 'sage' },
    { name: 'Player 2', time: 60, initialTime: 60, isActive: false, color: 'lavender' },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isEditing, setIsEditing] = useState(true);
  const [isReverseEnabled, setIsReverseEnabled] = useState(false);
  const [isSkipEnabled, setIsSkipEnabled] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const [previousPlayerIndex, setPreviousPlayerIndex] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setPlayers(prevPlayers => {
          const newPlayers = [...prevPlayers];
          const currentPlayer = newPlayers[currentPlayerIndex];
          if (currentPlayer.time > 0) {
            currentPlayer.time -= 1;
          }
          return newPlayers;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentPlayerIndex, players]);

  useEffect(() => {
    if (showUndo) {
      const timer = setTimeout(() => setShowUndo(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showUndo]);

  const toggleTimer = () => {
    if (isRunning) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
      if (!gameStarted) {
        setGameStarted(true);
        setShowTutorial(true);
      }
    }
    setIsRunning(!isRunning);
  };

  const resetTimers = () => {
    setPlayers(players.map(player => ({ ...player, time: player.initialTime, isActive: false })));
    setIsRunning(false);
    setCurrentPlayerIndex(0);
    setIsEditing(true);
    setGameStarted(false);
    setShowTutorial(true);
  };

  const addPlayer = () => {
    const availableColors = Object.keys(colors).filter(color => !players.some(player => player.color === color));
    const newColor = availableColors[0] || Object.keys(colors)[0];
    setPlayers([...players, { name: `Player ${players.length + 1}`, time: 60, initialTime: 60, isActive: false, color: newColor }]);
  };

  const removePlayer = () => {
    if (players.length > 2) {
      setPlayers(players.slice(0, -1));
    }
  };

  const moveToNextPlayer = (currentIndex, currentDirection) => {
    return (currentIndex + currentDirection + players.length) % players.length;
  };

  const toggleDirection = () => {
    if (isReverseEnabled && isRunning) {
      setDirection(prevDirection => prevDirection * -1);
      setCurrentPlayerIndex(prevIndex => {
        const newIndex = moveToNextPlayer(prevIndex, -direction);
        setPlayers(prevPlayers => {
          const newPlayers = [...prevPlayers];
          newPlayers[newIndex].time = newPlayers[newIndex].initialTime;
          return newPlayers;
        });
        return newIndex;
      });
      setShowUndo(true);
    }
  };

  const skipNextPlayer = () => {
    if (isSkipEnabled && isRunning) {
      setPreviousPlayerIndex(currentPlayerIndex);
      setCurrentPlayerIndex(prevIndex => {
        const skippedIndex = moveToNextPlayer(prevIndex, direction);
        const newIndex = moveToNextPlayer(skippedIndex, direction);
        setPlayers(prevPlayers => {
          const newPlayers = [...prevPlayers];
          newPlayers[newIndex].time = newPlayers[newIndex].initialTime;
          return newPlayers;
        });
        return newIndex;
      });
      setShowUndo(true);
    }
  };

  const handleAreaClick = () => {
    if (isRunning && !isEditing) {
      nextTurn();
    }
  };

  const nextTurn = () => {
    setPreviousPlayerIndex(currentPlayerIndex);
    setCurrentPlayerIndex(prevIndex => {
      const newIndex = moveToNextPlayer(prevIndex, direction);
      setPlayers(prevPlayers => {
        const newPlayers = [...prevPlayers];
        newPlayers[newIndex].time = newPlayers[newIndex].initialTime;
        return newPlayers;
      });
      return newIndex;
    });
    setShowUndo(true);
  };

  const undoTurn = () => {
    if (previousPlayerIndex !== null) {
      setCurrentPlayerIndex(previousPlayerIndex);
      setPreviousPlayerIndex(null);
      setShowUndo(false);
    }
  };

  const updatePlayerName = (index, newName) => {
    if (isEditing) {
      const newPlayers = [...players];
      newPlayers[index].name = newName;
      setPlayers(newPlayers);
    }
  };

  const updatePlayerTime = (index, newTime) => {
    if (isEditing) {
      const newPlayers = [...players];
      newPlayers[index].time = parseInt(newTime, 10) || 0;
      newPlayers[index].initialTime = parseInt(newTime, 10) || 0;
      setPlayers(newPlayers);
    }
  };

  const updatePlayerColor = (index, newColor) => {
    if (isEditing) {
      const newPlayers = [...players];
      newPlayers[index].color = newColor;
      setPlayers(newPlayers);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleResetConfirm = () => {
    resetTimers();
    setShowResetConfirmation(false);
  };

  const handleResetCancel = () => {
    setShowResetConfirmation(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-gray-100">
      {showTutorial && gameStarted && (
        <Alert className="mb-4">
          <p>Click anywhere in the cards area to move to the next turn. The current player's card is highlighted.</p>
          <Button onClick={() => setShowTutorial(false)} className="mt-2" variant="outline">Got it!</Button>
        </Alert>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        <Button onClick={toggleTimer} variant="outline" className="py-7 col-span-2 sm:col-span-1">
          {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
          {isRunning ? 'Pause' : (gameStarted ? 'Resume' : 'Start')}
        </Button>

        {(!isEditing && isReverseEnabled) && (
          <Button onClick={toggleDirection} variant="outline" className="py-7 col-span-2 sm:col-span-1">
            <ArrowLeftRight className="mr-2" />
            Reverse
          </Button>
        )}

        {(!isEditing && isSkipEnabled) && (
          <Button onClick={skipNextPlayer} variant="outline" className="py-7 col-span-2 sm:col-span-1">
            <SkipForward className="mr-2" />
            Skip
          </Button>
        )}

        {isEditing && (
          <>
            <Button onClick={addPlayer} variant="outline" className="py-7"><UserPlus className="mr-2" />Add Player</Button>
            <Button onClick={removePlayer} variant="outline" className="py-7"><UserMinus className="mr-2" />Remove Player</Button>

            <CustomAlertDialog 
              isOpen={showResetConfirmation}
              onOpenChange={setShowResetConfirmation}
              onConfirm={handleResetConfirm}
              onCancel={handleResetCancel}
            />
            <Button onClick={() => setShowResetConfirmation(true)} variant="outline" className="py-7">
              <RotateCcw className="mr-2" />Reset
            </Button>


            <div className="col-span-2 sm:col-span-3 flex items-center space-x-2">
              <Switch
                id="reverse-mode"
                checked={isReverseEnabled}
                onCheckedChange={setIsReverseEnabled}
              />
              <Label htmlFor="reverse-mode">Enable Reverse Mode</Label>
            </div>

            <div className="col-span-2 sm:col-span-3 flex items-center space-x-2">
              <Switch
                id="skip-mode"
                checked={isSkipEnabled}
                onCheckedChange={setIsSkipEnabled}
              />
              <Label htmlFor="skip-mode">Enable Skip Mode</Label>
            </div>
          </>
        )}
      </div>

      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"
        onClick={handleAreaClick}
        style={{ cursor: isRunning && !isEditing ? 'pointer' : 'default' }}
      >
        {players.map((player, index) => (
          <Card 
            key={index} 
            className={`transition-all duration-200 ease-in-out ${index === currentPlayerIndex ? 'ring-4 ring-offset-2' : ''}`}
            style={{
              borderColor: colors[player.color], 
              backgroundColor: `${colors[player.color]}22`,
              transform: index === currentPlayerIndex ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <CardContent className="p-4">
              {!isEditing ? (
                <>
                  <div className="text-3xl font-bold text-center mb-1">{formatTime(player.time)}</div>
                  <div className="text-sm text-center">{player.name}</div>
                </>
              ) : (
                <>
                  <VisuallyHidden as="h3">
                    <CardHeader>
                      <CardTitle>{player.name}</CardTitle>
                    </CardHeader>
                  </VisuallyHidden>
                  <Input
                    value={player.name}
                    onChange={(e) => updatePlayerName(index, e.target.value)}
                    className="text-lg font-bold mb-2"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <Input
                      type="number"
                      value={player.initialTime}
                      onChange={(e) => updatePlayerTime(index, e.target.value)}
                      className="w-20 mr-2"
                    />
                    <span>seconds</span>
                  </div>
                  <Select value={player.color} onValueChange={(value) => updatePlayerColor(index, value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Color" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(colors).map(([colorName, colorValue]) => (
                        <SelectItem key={colorName} value={colorName}>
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: colorValue}}></div>
                            {colorName.charAt(0).toUpperCase() + colorName.slice(1)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {showUndo && (
        <Button onClick={undoTurn} className="mt-4 w-full" variant="outline" size="sm">
          <Undo className="mr-2" />
          Undo Last Turn
        </Button>
      )}
    </div>
  );
};

export default MultiplayerTimer;
