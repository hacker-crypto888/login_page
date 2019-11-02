import React from 'react';
import logo from './logo.svg';
import './App.css';
const bcrypt = require("bcryptjs");
const fetch = require('node-fetch');

class Component2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: '', password:'', plainTextPassword1:'',  };
  }
  signIn = (event) => {
    document.getElementById('idUsername1').className="";
    document.getElementById('idPassword1').className="";
    const password = document.getElementById('idPassword1').value;
    const username = document.getElementById('idUsername1').value;
    if(username.length === 0) {return;}
    //const username = 
    //const password = 
    fetch('https://api-words-texts-write.herokuapp.com/userdata') //returns the json containing all the passwords
      .then(res => res.json())
      .then(passwords => {
        if(passwords.some(x=> bcrypt.compareSync(password, x.password) && username === x.username)) {
          //post message to api to say that the password is correct and send the username. at reception the connection must be allowed for this user
          fetch('https://api-words-texts-write.herokuapp.com/username', {
            method: 'POST',
            body: JSON.stringify({"username":this.state.username, "login": "correct"}),
            headers: {"Content-Type":"application/json"},
          });

          window.location.href="https://words-texts-write.herokuapp.com/";
        } else {
          fetch('https://api-words-texts-write.herokuapp.com/username', {
            method: 'POST',
            body: JSON.stringify({"username":this.state.username, "login": "incorrect"}),
            headers: {"Content-Type":"application/json"},
          });
          document.getElementById('idUsername1').classList.add('error-signin');
          document.getElementById('idPassword1').classList.add('error-signin');
        }
      })
  }

  signUp = (event) => {
    document.getElementById('idUsername2').className="";
    document.getElementById('idPassword2').className="";
    //const username = 
    //const password = 
    const plainTextPassword1 = document.getElementById('idPassword2').value;
    const password = document.getElementById('idPassword2').value;
    const username = document.getElementById('idUsername2').value;
    fetch('https://api-words-texts-write.herokuapp.com/userdata') //returns all users' pass
      .then(res => res.json())
      .then(passwords => {
        if(passwords.some(x=> this.state.username === x.username)||document.getElementById("idUsername2").value.length === 0||document.getElementById("idPassword2").value.length === 0) {
          document.getElementById('idUsername2').classList.add('error-signin');
          document.getElementById('idPassword2').classList.add('error-signin');
          document.getElementById('idMessage2').innerHTML = "<p>username already taken</p>";
        } else {
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(this.state.plainTextPassword1, salt, function(err, hash) {
              fetch('https://api-words-texts-write.herokuapp.com/writeallusers', { //write all the passwords together
                method: 'POST',
                body: JSON.stringify(passwords.push({"username":this.state.username, "password": hash})),
                headers: {"Content-Type":"application/json"},

              });
              // Store hash in your password DB.
            });
          });
        }
      });
  }

  render() {
    return (
      <form>
        <div className="App">
          <br><input id="idUsername1" name="signin" value=""/>
          <br><input id="idPassword1" name="signin" value=""/>
          <br><input onClick={this.signIn} type="button" id="btnSignin" name="signin" value="Sign in"/> 
          <br><div id="idMessage1"></div>
        </div>
        <div className="App">
          <br><input id="idUsername2" name="signup" value=""/>
          <br><input id="idPassword2" name="signup" value=""/>
          <br><input onClick={this.signUp} type="button" id="btnSignup" name="signup" value="Sign up"/> 
          <br><div id="idMessage2"></div>
        </div>
      </form>
    );
  }
}

const SidebarItem = (props) => (
  <div style={{
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    padding: '5px 10px'
  }} {...props}/>
)

const Main = (props) => (
  <div style={{
    flex: 1,
    height: '100vh',
    overflow: 'auto'
  }}>
    <div style={{ padding: '20px' }} {...props}/>
  </div>
)

export default Component2;
