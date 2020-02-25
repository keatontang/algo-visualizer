import React, { Component } from "react";
import Node from "./Node/Node";
import "./AlgorithmVisualizer.css";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import GitHubIcon from "@material-ui/icons/GitHub";
import IconButton from "@material-ui/core/IconButton";

import { dijkstra, getNodesInShortestPath } from "../algorithms/dijkstra";

const START_NODE_ROW = 10;
const START_NODE_COLUMN = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COLUMN = 35;

export default class AlgorithmVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      movingStart: false,
      movingFinish: false,
      startNodeRow: 10,
      startNodeColumn: 15,
      finishNodeRow: 10,
      finishNodeColumn: 35
    };
  }

  //This will initialize the grid and set the state of nodes
  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }
  //these functions handle user-input walls
  handleMouseDown(row, column) {
    if (this.state.grid[row][column].isStart) {
      this.setState({ movingStart: true, mouseIsPressed: true });
    } else if (this.state.grid[row][column].isFinish) {
      this.setState({ movingFinish: true, mouseIsPressed: true });
    } else {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, column);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, column) {
    if (!this.state.mouseIsPressed) return;
    if (this.state.movingStart) {
      const newGrid = getNewGridWithStartMoved(this.state.grid, row, column);
      newGrid[row][column].isStart = true;
      this.setState({
        grid: newGrid,
        startNodeRow: row,
        startNodeColumn: column
      });
    } else if (this.state.movingFinish) {
      const newGrid = getNewGridWithFinishMoved(this.state.grid, row, column);
      newGrid[row][column].isFinish = true;
      this.setState({
        grid: newGrid,
        finishNodeRow: row,
        finishNodeColumn: column
      });
    } else {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, column);
      this.setState({ grid: newGrid });
    }
  }

  handleMouseLeave(row, column) {
    if (this.state.movingStart) {
      const newGrid = this.state.grid;
      newGrid[row][column].isStart = false;
      this.setState({ grid: newGrid });
    } else if (this.state.movingFinish) {
      const newGrid = this.state.grid;
      newGrid[row][column].isFinish = false;
      this.setState({ grid: newGrid });
    }
  }

  handleMouseUp() {
    this.setState({
      mouseIsPressed: false,
      movingStart: false,
      movingFinish: false
    });
  }

  visualizeDijkstra() {
    //disables all mouse events when the algorithm is visualizing
    document.getElementById("grid").style.pointerEvents = "none";
    const { grid } = this.state;
    const startNode = grid[this.state.startNodeRow][this.state.startNodeColumn];
    const finishNode =
      grid[this.state.finishNodeRow][this.state.finishNodeColumn];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPath(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.column}`).className =
          "node node-visited";
      }, 10 * i);
    }

    //Animate the shortest path
    setTimeout(() => {
      this.animateShortestPath(nodesInShortestPathOrder);
      // this.state.grid = getInitialGrid();
    }, 10 * visitedNodesInOrder.length);
    // this.state.grid = getInitialGrid();
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.column}`).className =
          "node node-path";
      }, 10 * i);
    }
  }

  //Clears the grid... by refreshing the page
  clearGrid() {
    window.location.reload(false);
  }
  render() {
    const { grid, mouseIsPressed } = this.state;

    //iterate through every row/column and create a grid
    return (
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">
              Pathfinding Algorithm Visualizer
            </Typography>
            <Button
              color="inherit"
              size="large"
              onClick={() => this.visualizeDijkstra()}
            >
              Visualize Dijkstra's Algorithm
            </Button>
            <br /> <br />
            <Button
              color="inherit"
              size="medium"
              onClick={() => this.clearGrid()}
            >
              Clear Grid
            </Button>
            <IconButton>
              <a href="https://github.com/keatontang" color="#fff">
                <GitHubIcon></GitHubIcon>
              </a>
            </IconButton>
            {/* <a href="https://github.com/keatontang">
              <GitHubIcon></GitHubIcon>
            </a> */}
          </Toolbar>
        </AppBar>
        <div className="grid" id="grid">
          {grid.map((row, rowIndex) => {
            return (
              <div key={rowIndex}>
                {row.map((node, nodeIndex) => {
                  const {
                    row,
                    column,
                    isStart,
                    isFinish,
                    isVisited,
                    isWall
                  } = node;
                  return (
                    <Node
                      key={nodeIndex}
                      isFinish={isFinish}
                      isStart={isStart}
                      isVisited={isVisited}
                      isWall={isWall}
                      row={row}
                      column={column}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, column) =>
                        this.handleMouseDown(row, column)
                      }
                      onMouseEnter={(row, column) =>
                        this.handleMouseEnter(row, column)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      onMouseLeave={() => this.handleMouseLeave(row, column)}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 25; row++) {
    const currentRow = [];
    for (let column = 0; column < 50; column++) {
      currentRow.push(createNode(column, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (column, row) => {
  return {
    column,
    row,
    //Boolean values that store if the node is in the finish/start position
    isStart: row === START_NODE_ROW && column === START_NODE_COLUMN,
    isFinish: row === FINISH_NODE_ROW && column === FINISH_NODE_COLUMN,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null
  };
};

const getNewGridWithWallToggled = (grid, row, column) => {
  const newGrid = grid.slice();
  const node = newGrid[row][column];
  const newNode = {
    ...node,
    isWall: !node.isWall
  };
  newGrid[row][column] = newNode;
  return newGrid;
};

const getNewGridWithStartMoved = (grid, row, column) => {
  const newGrid = grid.slice();
  const node = newGrid[row][column];
  const newNode = {
    ...node,
    isStart: !node.isStart
  };
  newGrid[row][column] = newNode;
  return newGrid;
};

const getNewGridWithFinishMoved = (grid, row, column) => {
  const newGrid = grid.slice();
  const node = newGrid[row][column];
  const newNode = {
    ...node,
    isFinish: !node.isFinish
  };
  newGrid[row][column] = newNode;
  return newGrid;
};

//This will turn any visited node into an unvisited node
// const clearGridOfAlgorithm = grid => {
//   const newGrid = grid.slice();
//   for (let row = 0; row < 20; row++) {
//     for (let column = 0; column < 50; column++) {
//       if (newGrid[row][column].isVisited) {
//         newGrid[row][column].isVisited = false;
//       }
//     }
//   }
//   return newGrid;
// };
