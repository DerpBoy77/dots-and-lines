# Dots and Lines Game

A web-based implementation of the classic "Dots and Boxes" game built with vanilla HTML, CSS, and JavaScript.

## 🎮 Game Overview

Dots and Lines is a strategy game where two players take turns drawing lines between dots on a grid. The goal is to complete squares by drawing the fourth side of a box. When a player completes a square, they score a point and get another turn.

## 🚀 Features

- **Multiple Game Modes**:
  - **Player vs Player**: Classic two-player mode
  - **Player vs Bot**: Play against an AI opponent
- **Two Game Styles**:
  - **Connected Mode**: Players can only select lines connected to their previous move
  - **Freeform Mode**: Players can select any available line
- **Dynamic Grid Sizes**: Customizable grid from 3x3 to 16x16 dots
- **Interactive Grid**: Responsive dot grid with clickable lines
- **Advanced Visual Feedback**:
  - Animated grid generation with diagonal wave pattern
  - Valid lines are highlighted with pulsing animation
  - Selected lines are colored by player (red/blue)
  - Current player is highlighted in the score display
  - Smooth animations and transitions
- **Comprehensive UI**:
  - Options menu with game configuration
  - Winner overlay with final scores
  - Real-time score tracking
  - Game restart functionality
- **Smart Game Logic**:
  - Automatic square detection and scoring
  - Bonus turns for completing squares
  - Win condition detection with tie handling

## 🎯 How to Play

### Game Setup

1. **Choose Game Mode**: Select "Vs Player" for local multiplayer or "Vs Bot" to play against AI
2. **Select Game Style**:
   - **Connected**: Players must select lines connected to their previous move
   - **Freeform**: Players can select any available line
3. **Grid Size**: Choose from 3x3 to 16x16 dot grids using the slider
4. **Start Game**: Click "Start Game" to begin

### Gameplay

1. **Starting**: Player 1 begins and can select any line on the grid (or any connected line in Connected mode)
2. **Line Selection**: Click on any highlighted (valid) line to select it
3. **Connected Mode**: After the first line, you can only select lines connected to the endpoints of your previous line
4. **Freeform Mode**: You can select any unselected line at any time
5. **Completing Squares**: When you complete a square (all 4 sides), you get another turn and score a point
6. **Switching Turns**: If you don't complete a square, the turn passes to the other player
7. **Winning**: The player with the most completed squares when all lines are drawn wins

## 🛠️ Installation & Setup

1. **Clone or Download** the repository
2. **File Structure**:
   ```
   dots-and-lines/
   ├── src/
   │   ├── index.html        # Main HTML file
   │   ├── main.js          # Core game logic
   │   ├── main.css         # Styling and animations
   │   ├── bot.js           # AI opponent logic
   │   └── animations.js    # Grid animation system
   ├── LICENSE
   └── README.md
   ```
3. **Run the Game**:
   - Open `src/index.html` in any modern web browser
   - No server setup required!
   - Works offline once loaded

## 🎨 Game Configuration

### In-Game Options

- **Grid Size**: Adjustable from 3x3 to 16x16 via the options menu slider
- **Game Mode**: Toggle between Player vs Player and Player vs Bot
- **Game Style**: Switch between Connected and Freeform modes
- **All settings**: Accessible through the "Options" button in the main game

### Developer Configuration

You can further customize the game by modifying constants in `main.js`:

```javascript
const CONFIG = {
  gridSize: 10, // Default grid size (overridden by UI)
  dotSize: 16, // Size of dots in pixels
  lineWidth: 54, // Width of horizontal lines
  lineHeight: 8, // Height of lines
  players: ["Player 1", "Player 2"],
  playerColors: ["#ff4444", "#4444ff"], // Red and Blue
};

const CONSTANTS = {
  GRID_MIN_SIZE: 3, // Minimum grid size
  GRID_MAX_SIZE: 16, // Maximum grid size
  ANIMATION_DELAY: 150, // UI animation timing
  BOT_MOVE_DELAY: 100, // Bot thinking delay
  // ... additional timing and positioning constants
};
```

## 🕹️ Controls

- **Mouse Click**: Select available lines
- **Options Button**: Access game configuration menu
- **Restart Button**: Reset current game
- **Visual Cues**:
  - Pulsing highlighted lines = available to select
  - Red lines = Player 1's selections
  - Blue lines = Player 2's selections
  - Highlighted player box = current turn
  - Colored squares = completed squares by each player

## 🏗️ Technical Details

### Architecture

- **Frontend Only**: Pure HTML/CSS/JavaScript - no frameworks or dependencies
- **Modular Design**: Separated into logical modules (main, bot, animations)
- **ES6 Modules**: Clean import/export structure
- **Responsive Design**: Adapts to different screen sizes
- **Centralized State**: Single game state object managing all game data
- **Event-Driven**: Click-based interaction with comprehensive event handling

### Key Components

- **Grid Generation**: Dynamic creation of dots and lines with configurable sizes
- **Animation System**: Diagonal wave pattern for grid appearance with staggered timing
- **AI Opponent**: Random move bot with extensible architecture for future improvements
- **Dual Game Modes**: Connected vs Freeform gameplay styles
- **Line Validation**: Smart detection of valid moves based on current game style
- **Square Detection**: Algorithm to identify completed squares and award points
- **Turn Management**: Player switching, bonus turns, and game mode handling
- **UI Management**: Modal overlays, options menu, and winner display

### Game Logic

1. **Grid Initialization**: Creates NxN dot grid with connecting lines
2. **Move Validation**:
   - **Connected Mode**: Only lines connected to previous moves are valid
   - **Freeform Mode**: Any unselected line is valid
3. **Square Completion**: Detects when all 4 sides of a square are completed
4. **Score Management**: Tracks completed squares per player with real-time updates
5. **Win Detection**: Determines winner when majority of squares completed or game ends
6. **Bot AI**: Simple random selection from valid moves (extensible for smarter AI)

## 🔧 Customization

### Runtime Configuration

- **Grid Size**: Use the in-game slider (3x3 to 16x16)
- **Game Modes**: Toggle between Player vs Player and Player vs Bot
- **Game Styles**: Switch between Connected and Freeform modes

### Developer Customization

#### Changing Default Settings

```javascript
// In main.js CONSTANTS object
const CONSTANTS = {
  DEFAULT_GRID_SIZE: 8, // Change default grid size
  GRID_MIN_SIZE: 2, // Change minimum grid size
  GRID_MAX_SIZE: 20, // Change maximum grid size
  BOT_MOVE_DELAY: 500, // Make bot think longer
  ANIMATION_DELAY: 300, // Slower animations
};
```

#### Changing Colors

```javascript
// In main.js CONFIG object
playerColors: ["#00ff00", "#ff8800"], // Green and Orange
```

#### Animation Timing

```javascript
// In animations.js
export const ANIMATION_CONSTANTS = {
  DOT_ANIMATION_DELAY: 50, // Slower dot animations
  LINE_ANIMATION_DELAY: 30, // Slower line animations
};
```

### Advanced Styling

Modify `main.css` to customize:

- Visual themes and color schemes
- Animation effects and timing
- Layout and spacing
- Button styles and hover effects
- Grid appearance and sizing

## 🚀 Future Enhancements

### Completed ✅

- [x] AI opponent (basic random bot)
- [x] Multiple grid size options in UI (3x3 to 16x16)
- [x] Animation improvements (diagonal wave pattern)
- [x] Two game modes (Connected vs Freeform)
- [x] Options menu and game configuration
- [x] Winner detection and game over screen

### Planned 🎯

- [ ] **Smarter AI**: Multiple difficulty levels with strategic algorithms
- [ ] **Sound Effects**: Audio feedback for moves, completions, and wins
- [ ] **Undo/Redo**: Move history and ability to undo moves
- [ ] **Game Statistics**: Track wins, games played, and performance metrics
- [ ] **Mobile Optimization**: Better touch controls and responsive design
- [ ] **Themes**: Multiple visual themes and color schemes
- [ ] **Multiplayer**: Online multiplayer support
- [ ] **Tournament Mode**: Bracket-style competitions
- [ ] **Accessibility**: Screen reader support and keyboard navigation
- [ ] **Performance**: Optimizations for larger grids

## 📱 Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

---

**Enjoy playing Dots and Lines!** 🎲
