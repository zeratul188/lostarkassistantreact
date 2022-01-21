import React from 'react';
import ReactDOM from 'react-dom';
import './event-style.css';

// eslint-disable-next-line no-undef
var storage = firebase.storage();
var storageRef = storage.refFromURL('gs://lostarkhub-cbe60.appspot.com/Events/');
// eslint-disable-next-line no-undef
var database = firebase.database();

var events = [];

var eventRef = database.ref('event');

class Events extends React.Component {
    renderEvent(i) {
        return <Event
            value={this.props.event[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    render() {
        return (
            <div className='events-container'>
                {this.renderEvent(0)}
                {this.renderEvent(1)}
                {this.renderEvent(2)}
            </div>
        );
    }
}

function Event(props) {
    if (props.value === undefined) {
        return null;
      }
      return (
        <div
            className='event-box'
            onClick={props.onClick}>
            <img src={props.value.imgurl}/>
            <p>
                {props.value.startdate} ~ {props.value.enddate}
            </p>
        </div>
      );
}

class EventBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: []
        }
        this.syncData();
    }

    syncData() {
        eventRef.on('value', (snapshot) => {
            snapshot.forEach((dinoSnapshot) => {
                var event = {
                    number: 0,
                    startdate: '',
                    enddate: '',
                    url: '',
                    imgurl: ''
                };
                dinoSnapshot.forEach((semiSnapshot) => {
                    if (semiSnapshot.key === 'number') {
                        event.number = semiSnapshot.val();
                    } else if (semiSnapshot.key === 'startdate') {
                        event.startdate = semiSnapshot.val();
                    } else if (semiSnapshot.key === 'enddate') {
                        event.enddate = semiSnapshot.val();
                    } else if (semiSnapshot.key === 'url') {
                        var sample = semiSnapshot.val();
                        sample = sample.replace('m-', '');
                        event.url = sample;
                    }
                });
                storageRef.child('event'+event.number).getDownloadURL().then((url) => {
                    var xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = (event) => {
                    var blob = xhr.response;
                    };
                    xhr.open('GET', url);
                    xhr.send();
        
                    event.imgurl = url;
                    this.setState({
                        events: events
                    });
                }).catch((error) => {
                    switch (error.code) {
                      case 'storage/object-not-found':
                        console.log('File doesn\'t exist');
                        break;
                      case 'storage/unauthorized':
                        console.log('User doesn\'t have permission to access the object')
                        break;
                      case 'storage/canceled':
                        console.log('User canceled the upload');
                        break;
                      case 'storage/unknown':
                        console.log('Unknown error occurred, inspect the server response');
                        break;
                        default:
                            console.log('other error');
                    }
                  });
                  events.push(event);
            });
            events = events.sort((a, b) => {
                return a.number - b.number;
            }).reverse();
            this.setState({
                events: events
            });
        });
    }

    handleClick(index) {
        const list = this.state.events;
        const event = list[index];
        var newWindow = window.open("about:blank");
        newWindow.location.href = event.url;
      }

    render() {
        const result = [];
        for (let i = 0; i < events.length; i += 3) {
            result.push(
                <Events
                    event = {cutEvents(this.state.events, i)}
                    onClick = {(t) => this.handleClick(t+i)}/>
            );
        }
        return result;
    }
}

function cutEvents(list, i) {
    const arr = [];
    arr.push(list[i]);
    arr.push(list[i+1]);
    arr.push(list[i+2]);
    return arr;
}

const eventContainer = document.querySelector('#event-root');
ReactDOM.render(
  <EventBoard/>,
  eventContainer
);