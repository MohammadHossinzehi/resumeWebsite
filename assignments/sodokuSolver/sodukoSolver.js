function setBoard()
{
    // Get all the table cells
    var cells = document.querySelectorAll("#myTable td input");
    // Create a 2D array to hold the table data
    var data = [];
    // Loop through the cells and populate the 2D array
    var row = [];
    cells.forEach(function(cell, index) 
    {
        row.push(parseInt(cell.value));
        if ((index + 1) % 9 === 0) 
        {
          data.push(row);
          row = [];
        }
    });
    // Call solveSudoku with the populated data array
    data = solveSudoku(data);
    if(data == null)
        alert("The board you have inputed is imposible to solve.");
    else
        output(data);
}
function solveSudoku(board) 
{
    if(solveHelper(board)) 
      return board;
    return null;
}
function solveHelper(board) 
{
    for (let row = 0; row < 9; row++)//going through each row of the board
    {
      for (let col = 0; col < 9; col++) //going through each coloumn of the board
      {
        if (board[row][col] === 0)//checks if number equals zero
        {
          for (let num = 1; num <= 9; num++)//goes through 
          {
            if (isValidMove(board, row, col, num)) 
            {
              board[row][col] = num;
              if (solveHelper(board)) {
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
function isValidMove(board, row, col, num) 
{
    // Check row
    for (let i = 0; i < 9; i++) 
    {
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
function output(data)
{
    var table = document.getElementById("myTable1");
    table.innerHTML = "";
    for (var i = 0; i < data.length; i++) {
        var row = table.insertRow();
        for (var j = 0; j < data[i].length; j++) {
          var cell = row.insertCell();
          cell.innerHTML = data[i][j];
        }
    }
}
function resetSudoku() {
  const inputs = document.querySelectorAll('input1');
  inputs.forEach(input => {
    input.value = '';
  });
}