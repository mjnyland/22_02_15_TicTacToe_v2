/*

true = O
false = X

*/

// Display controller for making moves
const Board = (() => {

    let currentTurn = true;

    let xOwned = [];
    let oOwned = [];

    let winCombos = [
        ["0", "1", "2"],
        ["3", "4", "5"],
        ["6", "7", "8"],
        ["0", "3", "6"],
        ["1", "4", "7"],
        ["2", "5", "8"],
        ["0", "4", "8"],
        ["6", "7", "8"]]

    const checkWin = () => {
        let winner = {};
        winCombos.forEach(arr => {
            const xWinner = xOwned.filter(value => arr.includes(value))
            xWinner.length === 3 ? winner = {winningArr: xWinner, winningPlayer: 'X'} : null;

            const oWinner = oOwned.filter(value => arr.includes(value))
            oWinner.length === 3 ? winner = {winningArr: oWinner, winningPlayer: 'O'} : null;
        })
        return winner;
    }

    const checkTie = () => {
        return (xOwned.length + oOwned.length === 9 ? true : false);
    }

    return {
        currentTurn,
        xOwned,
        oOwned,
        checkWin,
        checkTie
    }
})();


const Display = (() => {

    //Selecting relevant elements
    const body = document.querySelector('BODY')
    const squares = document.querySelectorAll('.square');
    const blueSquare = document.querySelector('.board');

    //Writing methods

    const createDOMElement = (tag, elementClass) => {
        const newElem = document.createElement(tag)
        newElem.className = elementClass;
        return newElem;
    }

    const createSVG = (player) => {
        if (player){
            let newO = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            newO.setAttribute("width", "64");
            newO.setAttribute("height", "64");
            let newOPath = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
            newOPath.setAttribute("d","M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z"); //Set path's data
            newOPath.setAttribute("fill", "#F2B137");
            newO.appendChild(newOPath);
            return newO;
        } else {
            let newX = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            newX.setAttribute("width", "64");
            newX.setAttribute("height", "64");
            let newXPath = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
            newXPath.setAttribute("d","M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z"); //Set path's data
            newXPath.setAttribute("fill", "#31C3BD");
            newXPath.setAttribute("fill-rule", "evenodd")
            newX.appendChild(newXPath);
            return newX;
        }
    }

    const displayMove = (i) => {
        squares[i].appendChild(createSVG(Board.currentTurn));
        Board.currentTurn = !Board.currentTurn;
    };

    const displayWinningSquares = (result) => {
        for (let i = 0; i<result.winningArr.length; i++){
            const index = parseInt(result.winningArr[i])
            result.winningPlayer === 'X' ? squares[index].style.backgroundColor = '#31C3BD' : squares[index].style.backgroundColor = '#F2B137';
            squares[index].children[0].children[0].style.fill = '#1A2A33';
        }
    }

    //Adding event handlers

    document.addEventListener('click', (e) => {
        if(e.target.className === 'square'){
            e.target.style.pointerEvents = 'none';
            const arr = [...squares]
            const index = arr.indexOf(e.target);
            displayMove(index);
            Board.currentTurn ? Board.xOwned.push(index.toString()) : Board.oOwned.push(index.toString())
            let checkWinResult = Board.checkWin();

            //if a win is detected
            if(checkWinResult.winningPlayer){
                displayWinningSquares(checkWinResult);
                const winModal = createDOMElement('div', 'win-modal');
                const winText = createDOMElement('H1', 'win-heading');
                const modalShadow = createDOMElement('div', 'win-modal-shadow');
                checkWinResult.winningPlayer === 'X' ? winText.style.color = '#31C3BD' : winText.style.color = '#F2B137';

                winText.textContent = `${checkWinResult.winningPlayer} WINS!`
                winModal.append(winText);
                body.append(winModal, modalShadow);
            } else if (Board.checkTie()) {
                const tieModal = createDOMElement('div', 'tie-modal');
                const tieText = createDOMElement('H1', 'win-heading');
                const modalShadow = createDOMElement('div', 'win-modal-shadow');
                tieText.textContent = `TIE!`;
                tieText.style.color = '#A8BFC9'
                tieModal.append(tieText);
                body.append(tieModal, modalShadow);
            }            
        }
    })
})();