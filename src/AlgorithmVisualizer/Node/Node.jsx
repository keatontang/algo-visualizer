import React, { Component } from "react";
import "./Node.css";

export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      column,
      isFinish,
      isStart,
      isVisited,
      row,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      onMouseLeave
    } = this.props;
    const extraClassName = isFinish
      ? "node-finish"
      : isStart
      ? "node-start"
      : isVisited
      ? "node-visited"
      : isWall
      ? "node-wall"
      : "";

    return (
      <div
        id={`node-${row}-${column}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, column)}
        onMouseEnter={() => onMouseEnter(row, column)}
        onMouseUp={() => onMouseUp()}
        onMouseLeave={() => onMouseLeave(row, column)}
      ></div>
    );
  }
}

export const DEFAULT_NODE = {
  row: 0,
  column: 0
};
