import React from 'react';
import logo from './logo.svg';
import './App.css';
const bcrypt = require("bcryptjs");
//const fetch = require('node-fetch');

class Component2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: '', password:'', plainTextPassword1:'', password1:'', username1:'', password2:'', username2:'', };
  }
  componentDidMount = () => {
    fetch('http://api-words-texts-write.herokuapp.com/test')
      .then(res=>res.text())
      .then(resp=>document.getElementById('idMessage1').innerHTML = resp)
    document.getElementsByClassName('inputtext').onClick = (event) => {
      event.target.onkeydown =(event) => {
        event.target.focus();
      }
    }
  }
  signIn = (event) => {
    document.getElementById('idUsername1').className="";
    document.getElementById('idPassword1').className="";
    if(document.getElementById('idPassword1').value.length === 0) {return;}
    if(document.getElementById('idUsername1').value.length === 0) {return;}
    //const username = 
    //const password = 
    fetch('https://api-words-texts-write.herokuapp.com/userdata') //returns the json containing all the passwords
      .then(res => res.json())
      .then(passwords => {
        document.getElementById('idMessage2').innerHTML += 'content json'+JSON.stringify(passwords);
        if(passwords.some(x=> bcrypt.compareSync(document.getElementById('idPassword1').value, x.password) && document.getElementById('idUsername1').value === x.username)) {
          //post message to api to say that the password is correct and send the username. at reception the connection must be allowed for this user
          fetch('https://api-words-texts-write.herokuapp.com/username', {
            method: 'POST',
            body: JSON.stringify({"username":document.getElementById('idUsername1').value, "login": "correct"}),
            headers: {"Content-Type":"application/json"},
          });
          window.location.href="https://words-texts-write.herokuapp.com/";
        } else {
          fetch('https://api-words-texts-write.herokuapp.com/username', {
            method: 'POST',
            body: JSON.stringify({"username":document.getElementById('idUsername1').value, "login": "incorrect"}),
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
    const username = this.state.username2;
    const password = this.state.password2;
    fetch('https://api-words-texts-write.herokuapp.com/userdata') //returns all users' pass
      .then(res => res.json())
      .then(passwords => {
        document.getElementById('idMessage2').innerHTML += JSON.stringify(passwords);
        if(passwords.some(x=> username === x.username)||document.getElementById("idUsername2").value.length === 0||document.getElementById("idPassword2").value.length === 0) {
          document.getElementById('idUsername2').classList.add('error-signin');
          document.getElementById('idPassword2').classList.add('error-signin');
          document.getElementById('idMessage2').innerHTML = "<p>username already taken</p>";
        } else {
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
              fetch('https://api-words-texts-write.herokuapp.com/writeallusers', { //write all the passwords together
                method: 'POST',
                body: JSON.stringify(passwords.push({"username":username, "password": hash})),
                headers: {"Content-Type":"application/json"},

              })
              .then(res=>res.json())
              .then(res2=>document.getElementById('idMessage2').innerHTML =res2)
              // Store hash in your password DB.
            });
          });
        }
      });
  }
  onChange = (event) => {
    this.setState({
      username1:
        event.target.username1,
      password1:
        event.target.password1,
      username2:
        event.target.username2,
      password2:
        event.target.password2,
    });
  }

  render() {
    return (
      <div>
        <div className="App">
          <br/><input className='inputtext' type="text" id="idUsername1" name="signin" value={this.state.username1} onChange={this.onChange}/>
          <br/><input className='inputtext' type="text" id="idPassword1" name="signin" value={this.state.password1} onChange={this.onChange}/>
          <br/><input onClick={this.signIn} type="button" id="btnSignin" name="signin" value="Sign in"/> 
          <br/><div id="idMessage1"/>
        </div>
        <div className="App">
          <br/><input className='inputtext' id="idUsername2" type="text" name="signup" value={this.state.username2} onChange={this.onChange}/>
          <br/><input className='inputtext' id="idPassword2" type="text" name="signup" value={this.state.password2} onChange={this.onChange}/>
          <br/><input onClick={this.signUp} type="button" id="btnSignup" name="signup" value="Sign up"/> 
          <br/><div id="idMessage2"/>
        </div>
      </div>
    );
  }
}


export default Component2;
