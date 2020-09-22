
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    render() {
      return (
        <button className="square" 
                onClick={() => this.props.onClick()}>
                {this.props.value}
        </button>
      );
    }
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
      />;
    }
  
    render() {  
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        history: [{
          squares: Array(9).fill(null),
        }],
        xIsNext: true,
        stepNumber: 0,
        datas: null,
      }
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((move,step)=>{
        const desc = step ? 
          'Go to move #' + step :
          'Go to game start';
        
        return (
          <li key={step}>
            <button onClick={()=>this.jumpTo(step)}>{desc}</button>
          </li>
        );
      });



      let status;
      if (winner) {
        status = 'Winner: ' + winner; 
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X':'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares = {current.squares}
              onClick= {(i)=>this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            <ul>
                {this.state.datas != null?  
                  this.state.datas.map(data=>( 
                    <li key={data.date}>
                        {data.date} {data.open} {data.high} {data.low} {data.close}
                    </li>
                  )) : null
                }
            </ul>
          </div>
        </div>
      );
    }

    handleClick(i){
      const history = this.state.history.slice(0,
        this.state.stepNumber + 1);
      const current = history[history.length-1];
      const squares = current.squares.slice();
    //  if (squares[i] == null)
      //  {
          if (calculateWinner(squares) || squares[i]) {
            return;
          }
          squares[i] = this.state.xIsNext ? "X":"O";
          this.setState({
              history: history.concat([{
                squares: squares,
              }]),
              stepNumber: history.length,
              xIsNext: !this.state.xIsNext});
     //   }

     fetch("https://jsonmock.hackerrank.com/api/stocks/")
      .then(resbody=>resbody.json())
      .then(resobj=>this.setState({
          history: this.state.history,
          stepNumber: this.state.stepNumber,
          xIsNext: this.state.xIsNext,
          datas: resobj.data,
                                  })
      );


    }

    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      })
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

  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  