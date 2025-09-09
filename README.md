# Dots and Lines Game

A web-based implementation of the classic "Dots and Boxes" game built with vanilla HTML, CSS, and JavaScript.

## 🎮 Game Overview

Dots and Lines is a strategy game where two players take turns drawing lines between dots on a grid. The goal is to complete squares by drawing the fourth side of a box. When a player completes a square, they score a point and get another turn.

## 🚀 Features

- **Interactive Grid**: 10x10 dot grid with clickable lines
- **Two-Player Gameplay**: Alternating turns between Player 1 (red) and Player 2 (blue)
- **Visual Feedback**:
  - Valid lines are highlighted with pulsing animation
  - Selected lines are colored by player
  - Current player is highlighted in the score display
- **Smart Line Selection**: Players can only select lines connected to their previous move
- **Score Tracking**: Real-time score updates based on completed squares
- **Bonus Turns**: Complete a square to get another turn
- **Game Reset**: Reset button to start a new game

## 🎯 How to Play

1. **Starting**: Player 1 begins and can select any line on the grid
2. **Line Selection**: Click on any highlighted (valid) line to select it
3. **Chain Movement**: After the first line, you can only select lines connected to the endpoints of your previous line
4. **Completing Squares**: When you complete a square (all 4 sides), you get another turn
5. **Switching Turns**: If you don't complete a square, the turn passes to the other player
6. **Winning**: The player with the most completed squares when all lines are drawn wins

## 🛠️ Installation & Setup

1. **Clone or Download** the repository
2. **File Structure**:
   ```
   dots-and-lines/
   ├── src/
   │   ├── index.html
   │   ├── main.js
   │   └── main.css
   └── README.md
   ```
3. **Run the Game**:
   - Open `src/index.html` in any modern web browser
   - No server setup required!

## 🎨 Game Configuration

You can customize the game by modifying the `CONFIG` object in `main.js`:

```javascript
const CONFIG = {
  gridSize: 10, // Number of dots per row/column
  dotSize: 16, // Size of dots in pixels
  lineWidth: 54, // Width of horizontal lines
  lineHeight: 8, // Height of lines
  players: ["Player 1", "Player 2"],
  playerColors: ["#ff4444", "#4444ff"], // Red and Blue
};
```

## 🕹️ Controls

- **Mouse Click**: Select available lines
- **Visual Cues**:
  - Gray dashed lines = available to select
  - Red lines = Player 1's selections
  - Blue lines = Player 2's selections
  - Highlighted player box = current turn

## 🏗️ Technical Details

### Architecture

- **Frontend Only**: Pure HTML/CSS/JavaScript - no frameworks
- **Responsive Design**: Adapts to different screen sizes
- **Game State Management**: Centralized state tracking
- **Event-Driven**: Click-based interaction system

### Key Components

- **Grid Generation**: Dynamic creation of dots and lines
- **Line Validation**: Smart detection of valid moves
- **Square Detection**: Algorithm to identify completed squares
- **Turn Management**: Player switching and bonus turn logic
- **Visual Feedback**: CSS animations and transitions

### Game Logic

1. **Line Connection**: Each line connects two adjacent dots
2. **Valid Move Detection**: Only lines connected to previous moves are selectable
3. **Square Completion**: Detects when all 4 sides of a square are drawn
4. **Score Calculation**: Tracks completed squares per player
5. **Game End**: Automatically detects when all lines are drawn

## 🔧 Customization

### Changing Grid Size

```javascript
// In main.js CONFIG object
gridSize: 5,  // Creates a 5x5 grid instead of 10x10
```

### Changing Colors

```javascript
// In main.js CONFIG object
playerColors: ["#00ff00", "#ff8800"], // Green and Orange
```

### Styling

Modify `main.css` to change:

- Visual themes
- Animation effects
- Layout and spacing
- Color schemes

## 🐛 Known Issues

- No AI opponent option
- No undo functionality

## 🚀 Future Enhancements

- [ ] AI opponent with difficulty levels
- [ ] Undo/Redo functionality
- [ ] Game history and statistics
- [ ] Multiple grid size options in UI
- [ ] Sound effects
- [ ] Animation improvements
- [ ] Mobile touch optimization

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
