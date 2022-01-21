import React from 'react';
import './update-create-style.css';

// eslint-disable-next-line no-undef
var database = firebase.database();

var updateFiles = [];
var btnLeft = document.querySelector('.update-left');
var btnRight = document.querySelector('.update-right');
var txtNum = document.querySelector('.update-buttons span');

let cnt = 1, lastCount = 1;

class Updates extends React.Component {
  renderUpdate(i) {
    return <Update
        value={this.props.update[i]}
        onClick={() => this.props.onClick(i)}
      />;
  }

  render() {
    return (
      <div>
        {this.renderUpdate(0)}
        {this.renderUpdate(1)}
        {this.renderUpdate(2)}
        {this.renderUpdate(3)}
        {this.renderUpdate(4)}
      </div>
    );
  }
}

function Update(props) {
  if (props.value === undefined) {
    return null;
  }
  return (
    <p
      className="update"
      onClick={props.onClick}
      >
        {props.value.date}
    </p>
  )
}

class UpdateBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startNumber: 0,
      updates: Array(5).fill(null)
    }
    this.firebaseAsyn();
    this.buttonListener(this);
  }

  buttonListener(board) {
    btnLeft.addEventListener('click', function onClick() {
      if (cnt === 1) {
        return;
      }
      cnt--;
      btnRight.style.color = '#FFFFFF';
      txtNum.textContent = cnt+' / '+lastCount;
      var list = cutUpdates((cnt-1)*5);
      board.setState({
        startNumber: (cnt-1)*5,
        updates: list
      });
      if (cnt === 1) {
        btnLeft.style.color = '#888888';
      }
    });

    btnRight.addEventListener('click', function onClick() {
      if (cnt === lastCount) {
        return;
      }
      cnt++;
      btnLeft.style.color = '#FFFFFF';
      txtNum.textContent = cnt+' / '+lastCount;
      var list = cutUpdates((cnt-1)*5);
      board.setState({
        startNumber: (cnt-1)*5,
        updates: list
      });
      if (cnt === lastCount) {
        btnRight.style.color = '#888888';
      }
    });
  }

  firebaseAsyn() {
    var updateRef = database.ref('update');
    updateRef.on('value', (snapshot) => {
      snapshot.forEach((dinoSnapshot) => {
        var update = {
          date: '',
          number: '',
          url: ''
        };
        dinoSnapshot.forEach((semiSnapshot) => {
          if (semiSnapshot.key === 'date') {
            update.date = semiSnapshot.val()+' 업데이트';
          } else if (semiSnapshot.key === 'number') {
            update.number = semiSnapshot.val();
          } else if (semiSnapshot.key === 'url') {
            var sample = semiSnapshot.val();
            sample = sample.replace('m-', '');
            update.url = sample;
          }
        });
        updateFiles.push(update);
        if (updateFiles.length%5 === 0){
          lastCount = Math.floor(updateFiles.length/5);
        } else {
          lastCount = Math.floor(updateFiles.length/5+1);
        }
        txtNum.textContent = '1 / '+lastCount;
      });
      updateFiles = updateFiles.sort((a, b) => {
        return a.number - b.number;
      }).reverse();
      var list = cutUpdates(this.state.startNumber);
      this.setState({
        updates: list
      });
    });
  }

  handleClick(index) {
    const list = this.state.updates;
    const updateFile = list[index];
    var newWindow = window.open("about:blank");
    newWindow.location.href = updateFile.url;
  }

  render() {
    return (
      <Updates
        update = {cutUpdates(this.state.startNumber)}
        onClick = {(i) => this.handleClick(i)}
      />
    );
  }
}

function cutUpdates(start) {
  var array = [];
  for (let i = 0; i < 5; i++) {
    array.push(updateFiles[start+i]);
  }
  return array;
}

export default UpdateBoard;