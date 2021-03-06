import React from 'react';
import logo from './logo.svg';
import './App.css';
const bcrypt = require("bcryptjs");
//const fetch = require('node-fetch');

class Component2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { values:[], username: '', password:'', plainTextPassword1:'', password1:'', username1:'', password2:'', username2:'', };
  }
  componentDidMount = () => {
    //document.getElementById('idMessage1').innerHTML = 'my messageeeeee';
    document.getElementById('btnSignup').setAttribute('disabled','disabled');
    //fetch('https://api-words-texts-write.herokuapp.com/test')
    //  .then(res=>res.text())
    //  .then(resp=>document.getElementById('idMessage1').innerHTML = resp)
    fetch('https://api-words-texts-write.herokuapp.com/userdata') //returns the json containing all the passwords
      .then(res => res.json())
      .then(res=>res.items)
      .then(res=>{
        if (!(res.length)){
          document.getElementById('idPassword1').setAttribute('disabled','disabled');
          document.getElementById('idUsername1').setAttribute('disabled','disabled');
          document.getElementById('btnSignin').setAttribute('disabled','disabled');
          document.getElementById('idMessage1').innerHTML = 'Sign up first';
        }
      })
      //document.getElementById('idPassword1').removeAttribute('disabled');
      //document.getElementById('idUsername1').removeAttribute('disabled');
      //document.getElementById('btnSignin').removeAttribute('disabled');
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
      .then(res=>res.items)
      .then(passwords => {
        //document.getElementById('idMessage2').innerHTML += 'content json'+JSON.stringify(passwords);
        if(passwords.some(x=> bcrypt.compareSync(document.getElementById('idPassword1').value, x.password) && document.getElementById('idUsername1').value === x.username)) {
          //post message to api to say that the password is correct and send the username. at reception the connection must be allowed for this user
          fetch('https://api-words-texts-write.herokuapp.com/username', {
            method: 'POST',
            body: JSON.stringify({"info":[document.getElementById('idUsername1').value, "correct"]}),
            headers: {"Content-Type":"application/json"},
          });
          window.location.href="https://words-texts-write.herokuapp.com/";
        } else {
          fetch('https://api-words-texts-write.herokuapp.com/username', {
            method: 'POST',
            body: JSON.stringify({"info":[document.getElementById('idUsername1').value, "incorrect"]}),
            headers: {"Content-Type":"application/json"},
          });
          document.getElementById('idUsername1').classList.add('error-signin');
          document.getElementById('idPassword1').classList.add('error-signin');
        }
      })
  }

  signUp = (event) => {
    const values = [this.state.username1, this.state.password1, this.state.username2, this.state.password2];
    this.setState({values});
    function sort(item){
      if(item === undefined) {return;}
      return item.length > 0;
    }
    if(this.state.values.filter(sort).some(x=>[' '].includes(x[x.length-1]))) {
      document.getElementById('idMessage1').innerHTML = '<p style=\"color:#FF0000\">there must be an error with the password or username you entered. check them again.</p>';
      return;
    } else {
    }
      
    document.getElementById('idUsername2').className="";
    document.getElementById('idPassword2').className="";
    //const username = 
    //const password = 
    //const username2 = this.state.username2;

    //const password2 = this.state.password2;
    //this.setState({username2});
    //this.setState({password2});
    if(document.getElementById('idUsername2').value.length === 0) {return;}
    if(document.getElementById('idPassword2').value.length === 0) {return;}
    fetch('https://api-words-texts-write.herokuapp.com/userdata') //returns all users' pass
      .then(res => res.json())
      .then(res=>res.items)
      .then(res=>{
        if(!(res instanceof Array)) { 
          return [] 
        } else {
          return res;
        }
      })
      .then(passwords => {
        if((passwords.length)&&(passwords.length!==0) && (passwords.some(x=> document.getElementById('idUsername2').value === x.username))) {
          document.getElementById('idMessage2').innerHTML = "<p>username already taken</p>";
          return;
        }
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(document.getElementById('idPassword2').value, salt, function(err, hash) {
              fetch('https://api-words-texts-write.herokuapp.com/writeallusers', { //write all the passwords together
                method: 'POST',
                body: JSON.stringify({"items":[...passwords, {"username":document.getElementById('idUsername2').value, "password": hash}]}),
                headers: {"Content-Type":"application/json"},
              })
              .then(document.getElementById('idMessage1').innerHTML='added a user')
              .then(document.getElementById('idUsername2').value='')
              .then(document.getElementById('idPassword2').value='')
          });
        });
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
    if((this.state.password2 !== null) && (this.state.username2 !== null)){
      document.getElementById('btnSignup').removeAttribute('disabled');
    } else {
      document.getElementById('btnSignup').setAttribute('disabled','disabled');
    }
    const values = [this.state.username1, this.state.password1, this.state.username2, this.state.password2];
    this.setState({values});
    function sort(item){
      if(item === undefined) {return;}
      return item.length > 0;
    }
    if(this.state.values.filter(sort).some(x=>[' '].includes(x[x.length-1]))) {
      document.getElementsByClassName('inputtext').forEach(el => {
        if(this.state.values.filter(sort).includes(el.value)) {
          el.classList.add('error-signin');
        } else {
          el.classList.remove('error-signin');
        }
      });
    } 
  }

  render() {
    return (
      <div>
        <div className="App">
          <br/><input className='inputtext' type="text" id="idUsername1" name="signin" value={this.state.username1} onChange={this.onChange}/>
          <br/><input className='inputtext' type="password" id="idPassword1" name="signin" value={this.state.password1} onChange={this.onChange}/>
          <br/><input onClick={this.signIn} type="button" id="btnSignin" name="signin" value="Sign in"/> 
          <br/><div id="idMessage1"/>
        </div>
        <div className="App">
          <br/><input className='inputtext' id="idUsername2" type="text" name="signup" value={this.state.username2} onChange={this.onChange}/>
          <br/><input className='inputtext' id="idPassword2" type="password" name="signup" value={this.state.password2} onChange={this.onChange}/>
          <br/><input onClick={this.signUp} type="button" id="btnSignup" name="signup" value="Sign up"/> 
          <br/><div id="idMessage2"/>
        </div>
      </div>
    );
  }
}


export default Component2;
