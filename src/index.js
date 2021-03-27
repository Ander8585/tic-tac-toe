import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//This component is the unit base of the square where the player put the 'X' or the 'O'
function Square (props) {   
  return (<button 
    className = "square" 
    onClick = {props.onClick}
    style = {props.style}//reference for setting custom colors: {background: 'rgb(0,255,0)'}
  >
    {props.value}
  </button>);    
}

//This is component is the whole board of the game and it is made by 3 SquareLines. 
//These SquaresLines are called by an Array.map() method.
class Board extends React.Component {
   /* constructor(props) {
        super(props);
        this.state = {
        squares: Array(9).fill(0),
        };
    }*/

    //This is the original RenderSquare function
   /* renderSquare(i,isSquareWinner) {
        return (<Square 
            value= {this.props.squares[i]} 
            onClick={() => this.props.onClick(i)}
            style={isSquareWinner ? {background: 'rgb(0,255,0)'} : {}}
            />
        );
    }*/
   //This method create the SquareLines of squares that form the board.
   renderRowSquare(offset,isSquareWinner) {
      const isSquareWinnerLines = isSquareWinner.slice(offset,offset+3);
      const SquareLines = isSquareWinnerLines.map((_value,_index) => {
        return <Square 
            key = {_index}
            value = {this.props.squares[offset + _index]}
            onClick = {() => this.props.onClick(offset + _index)}
            style = {_value ? {background: 'LightGreen'} : {}}
            />
      });
      return SquareLines;
   
    }

    
    //The render method creates the visual board making 
    //a callback with an array.map method to the method renderRowSquare.
    // my comment
    render() {
      console.log(process.env.REACT_APP_API);
      const tempArray = Array(3).fill(null);
      const table = tempArray.map((_value,_index) => {
        return (<div key= {_index} className= {("board-row" + _index)}>
                {this.renderRowSquare(3*_index,this.props.isSquareWinner)}
               </div>
        );
      });
        
      return ( <div>{table}</div>);
    }
}

//This component wrap the whole game and include the board
//and the rest of the items related to the Tic Tac Toe game
class Game extends React.Component {
    isSquareWinner = Array(9).fill(false);

    constructor(props){
        super(props);
        this.state = {
            history: [{
              squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
            stepReversed: false,
            
        };
        
    }
    //This is the handle of the onClick event who is 
    //passed as a prop until the buttons that form the board
    handleClick(i) {
        const history = this.state.history.slice(0,this.state.stepNumber+1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]){
          return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
         });
    }
    //This method update the state variables to go steps back
    JumpTo(step){
        this.setState({
            stepNumber:step,
            xIsNext: (step % 2) === 0,
        });
        this.isSquareWinner.fill(false);
    }

    //Calculate the coordinates (row, col) 
    //and the player to show in every step.
    CurrentPlay(currentSquare, PreviousSquare){
        for(let i =0 ; i < currentSquare.length ; i++){
            if(currentSquare[i] !== PreviousSquare[i])
                {   
                    return currentSquare[i] + '( ' + parseInt(i/3) + ', ' + i%3 + ')';
                }
        }
        

    }

    setReversed = (x='1') => {this.setState({stepReversed: !(this.state.stepReversed)});}
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      //const previous_current = history[this.state.stepNumber-1];
      const winner = calculateWinner(current.squares);
      

      const moves = history.map((_step, move) => {
          const desc = move ?
           'Go to move #' + move + '  ' +this.CurrentPlay(history[move].squares, history[move-1].squares):
           'Go to game start   (row,col)';
          return (
            <li key = {move} >
                <button className = 'steps' onClick = {() => {this.JumpTo(move)}}> {move === (history.length-1) ? <b>{desc}</b> :  desc} </button>
            </li>
          );
        });
      
      let status;
      if(winner){
          status = 'The WINNER is: ' + winner;
          const winnerSquares = calculateWinnerSquares(current.squares);
          //let TempIsSquareWinner = this.isSquareWinner.slice();
          for(let i =0; i<9; i++){
            if(i === winnerSquares[0] || i === winnerSquares[1] || i === winnerSquares[2]){
              this.isSquareWinner[i] = true;
            }
            else{
              this.isSquareWinner[i] = false;
            }
          }      
      }
      else if (this.state.stepNumber < 9){
          status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      else 
          status = 'This is a TIE! ';

      
      return ( //reference to use styles in JSX: style={{background: 'white'}}
        <div className="game">
          <div className="game-board">
            <p>0<br/>1<br/>2</p><Board 
              squares = {current.squares}
              onClick = {(i) => {this.handleClick(i)}}
              isSquareWinner = {this.isSquareWinner}
            />
          </div>
          <div className="game-info">
            <div font={{size:'20px'}} ><b>{status}</b></div>{/*clarify doudt about the diferent ways of calling the function for onClick event */}
            <div><button  onClick= {this.setReversed}>
                    {(this.state.stepReversed) ? 'Arrange Steps in Ascending Order' : 'Arrange Steps in Descending Order'}
                </button>
                <button  id = 'resetgame' onClick= {() => {document.location.reload();}}>
                    {'Reset Game'}
                </button>
            </div>
            <ol reversed= {this.state.stepReversed}>{this.state.stepReversed ? (moves.reverse()):moves}</ol>
            
          </div>
        </div>
      );
    }
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
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
}

function calculateWinnerSquares(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return Array(3).fill(-1);
}
  
  // ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);