import React, { Component } from "react"
import { TextField, List, ListItem, ListItemText } from "@material-ui/core"
import firebase from "firebase"
import "./App.css"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { text: "", messages: [] }
  }
  componentDidMount() {
    var config = {
      apiKey: "AIzaSyBJ0dwLnQHjn0JW0jT5UDrFJvUx_UsAfsI",
      authDomain: "fir-chat-app-bd62a.firebaseapp.com",
      databaseURL: "https://fir-chat-app-bd62a.firebaseio.com",
      projectId: "fir-chat-app-bd62a",
      storageBucket: "fir-chat-app-bd62a.appspot.com",
      messagingSenderId: "26433629619",
      appId: "1:26433629619:web:ed94acd19929b7da96efc6",
      measurementId: "G-X8Y31GKQVH"
    }
    firebase.initializeApp(config)
    firebase.analytics()
    this.getMessages()
  }

  onSubmit = event => {
    if (event.charCode === 13 && this.state.text.trim() !== "") {
      this.writeMessageToDB(this.state.text)
      this.setState({ text: "" })
    }
  }

  writeMessageToDB = message => {
    firebase
      .database()
      .ref("messages/")
      .push({
        text: message
      })
  }

  getMessages = () => {
    var messagesDB = firebase
      .database()
      .ref("messages/")
      .limitToLast(500)
    messagesDB.on("value", snapshot => {
      let newMessages = []
      snapshot.forEach(child => {
        var message = child.val()
        newMessages.push({ id: child.key, text: message.text })
      })
      this.setState({ messages: newMessages })
      this.bottomSpan.scrollIntoView({ behavior: "smooth" })
    })
  }

  renderMessages = () => {
    return this.state.messages.map(message => (
      <ListItem>
        <ListItemText
          style={{ wordBreak: "break-word" }}
          primary={message.text}
        />
      </ListItem>
    ))
  }

  render() {
    return (
      <div className="App">
        <List>{this.renderMessages()}</List>
        <TextField
          autoFocus={true}
          multiline={true}
          rowsMax={3}
          placeholder="Type something.."
          onChange={event => this.setState({ text: event.target.value })}
          value={this.state.text}
          onKeyPress={this.onSubmit}
          style={{ width: "98vw", overflow: "hidden" }}
        />
        <span ref={el => (this.bottomSpan = el)} />
      </div>
    )
  }
}

export default App
