const MAX_ITERATIONS = 100000; // Set a reasonable maximum number of iterations

function setBoard() {
  // Get all the table cells
  var cells = document.querySelectorAll("#myTable td input");
  // Create a 2D array to hold the table data
  var data = [];
  // Loop through the cells and populate the 2D array
  var row = [];
  cells.forEach(function (cell, index) {
    row.push(parseInt(cell.value) || 0); // Default to 0 if value is NaN
    if ((index + 1) % 9 === 0) {
      data.push(row);
      row = [];
    }
  });
  // Call solveSudoku with the populated data array
  data = solveSudoku(data);
  if (data === null) {
    alert("The board you have inputted is impossible to solve.");
  } else {
    output(data);
  }
}

function solveSudoku(board) {
  const result = solveHelper(board);
  return result ? board : null;
}

function solveHelper(board, iterationCount = { count: 0 }) {
  if (iterationCount.count > MAX_ITERATIONS) {
    // If maximum iterations are reached, return false to stop
    return false;
  }

  for (let row = 0; row < 9; row++) {
    // Going through each row of the board
    for (let col = 0; col < 9; col++) {
      // Going through each column of the board
      if (board[row][col] === 0) {
        // Checks if number equals zero
        for (let num = 1; num <= 9; num++) {
          // Goes through possible numbers
          if (isValidMove(board, row, col, num)) {
            board[row][col] = num;
            iterationCount.count++; // Increment iteration count
            if (solveHelper(board, iterationCount)) {
              return true;
            }
            board[row][col] = 0;
          }
        }
        // No valid number found for the current cell
        return false;
      }
    }
  }
  // All cells have been filled, puzzle is solved
  return true;
}

function isValidMove(board, row, col, num) {
  // Check row
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) {
      return false;
    }
  }
  // Check column
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) {
      return false;
    }
  }
  // Check box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (board[i][j] === num) {
        return false;
      }
    }
  }
  return true;
}

function output(data) {
  var originalTable = document.getElementById("myTable");
  var solvedTable = document.getElementById("myTableSolved");
  solvedTable.innerHTML = "";

  // Iterate through the rows and columns of the solution data
  for (var i = 0; i < data.length; i++) {
    var row = solvedTable.insertRow(); // Create a new row in the solved table
    for (var j = 0; j < data[i].length; j++) {
      var cell = row.insertCell(); // Create a new cell in the solved table
      cell.innerHTML = data[i][j]; // Set the solved value in the cell

      // Get the corresponding input element in the original table
      var originalInput = originalTable.rows[i].cells[j].querySelector("input");

      // Get the computed styles of the original input
      var computedStylesInput = window.getComputedStyle(originalInput);

      // Apply key styles from the original input
      cell.style.padding = computedStylesInput.padding;
      cell.style.textAlign = computedStylesInput.textAlign;
      cell.style.width = computedStylesInput.width;
      cell.style.height = computedStylesInput.height;
      cell.style.fontSize = computedStylesInput.fontSize;
      cell.style.backgroundColor = computedStylesInput.backgroundColor;
      cell.style.color = computedStylesInput.color;

      // Get the computed styles of the original td cell (for borders)
      var originalCell = originalTable.rows[i].cells[j];
      var computedStylesCell = window.getComputedStyle(originalCell);

      // Apply the border styles from the original cell
      cell.style.border = computedStylesCell.border;
      cell.style.borderWidth = computedStylesCell.borderWidth;
      cell.style.borderStyle = computedStylesCell.borderStyle;
      cell.style.borderColor = computedStylesCell.borderColor;
    }
  }
}

function resetSudoku() {
  // Select all input elements inside the table with ID "myTable"
  const inputs = document.querySelectorAll("#myTable input");
  // Loop through each input and clear its value
  inputs.forEach((input) => {
    input.value = "0";
  });
}
