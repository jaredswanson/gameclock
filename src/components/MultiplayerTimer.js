import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, UserPlus, UserMinus, Volume2, VolumeX, ArrowLeftRight } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

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
  const [direction, setDirection] = useState(1); // 1 for clockwise, -1 for counter-clockwise

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

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const nextTurn = () => {
    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      newPlayers[currentPlayerIndex].time = newPlayers[currentPlayerIndex].initialTime;
      return newPlayers;
    });
    setCurrentPlayerIndex(prevIndex => (prevIndex + direction + players.length) % players.length);
  };

  const resetTimers = () => {
    setPlayers(players.map(player => ({ ...player, time: player.initialTime, isActive: false })));
    setIsRunning(false);
    setCurrentPlayerIndex(0);
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

  const toggleDirection = () => {
    setDirection(prevDirection => prevDirection * -1);
  };

  const updatePlayerName = (index, newName) => {
    if (!isRunning) {
      const newPlayers = [...players];
      newPlayers[index].name = newName;
      setPlayers(newPlayers);
    }
  };

  const updatePlayerTime = (index, newTime) => {
    if (!isRunning) {
      const newPlayers = [...players];
      newPlayers[index].time = parseInt(newTime, 10) || 0;
      newPlayers[index].initialTime = parseInt(newTime, 10) || 0;
      setPlayers(newPlayers);
    }
  };

  const updatePlayerColor = (index, newColor) => {
    if (!isRunning) {
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

  return (
    <div className="p-4 max-w-4xl mx-auto bg-gray-100">
      <div className="flex flex-wrap justify-between mb-4 gap-2">
        <Button onClick={toggleTimer} variant="outline">
          {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={resetTimers} variant="outline"><RotateCcw className="mr-2" />Reset</Button>
        <Button onClick={addPlayer} variant="outline" disabled={isRunning}><UserPlus className="mr-2" />Add Player</Button>
        <Button onClick={removePlayer} variant="outline" disabled={isRunning}><UserMinus className="mr-2" />Remove Player</Button>
        <Button onClick={toggleDirection} variant="outline">
          <ArrowLeftRight className="mr-2" />
          Reverse Direction
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {players.map((player, index) => (
          <Card 
            key={index} 
            className={`transition-all duration-200 ease-in-out ${index === currentPlayerIndex ? 'ring-2 ring-offset-2' : ''}`}
            style={{borderColor: colors[player.color], backgroundColor: `${colors[player.color]}22`}}
          >
            <CardContent className="p-4">
              {isRunning ? (
                <>
                  <div className="text-3xl font-bold text-center mb-1">{formatTime(player.time)}</div>
                  <div className="text-sm text-center">{player.name}</div>
                </>
              ) : (
                <>
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
      <Button onClick={nextTurn} className="mt-4 w-full" variant="default" size="lg">Next Turn</Button>
    </div>
  );
};

export default MultiplayerTimer;