import React,{Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Facerecognition from './components/Facerecognition/Facerecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank';
import Particles  from 'react-particles-js';


const particlesOptions = {
  particles: {
    number:{
      value:50,
      density: {
        enable: true,
        value_area:800
      } 
    }
  }
}

const inintialState = {
    input:'',
    imgURL:'',
    box:{},
    route:'signin',
    isSignIn:false,
    user:{
      id:'',
      name:'',
      email:'',
      password:'',
      entries:0,
      joined:''
    }
}

class App extends Component {
  constructor(){
    super();
    this.state = inintialState;
  }

  loadUser = (data)=>{
    this.setState({
      user:{
        id: data.id,
        name:data.name,
        email:data.email,
        password:data.password,
        entries:data.entries,
        joined:data.joined
      }
    })
  }

  calculateFaceLocation = (data)=>{
    const clarifaiFace = data['outputs'][0]['data']['regions'][0]['region_info']['bounding_box'];
    console.log(clarifaiFace)
    
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log("width,height",(width,height))
    console.log(width, height)
    return {
      leftCol:clarifaiFace.left_col * width,
      topRow:clarifaiFace.top_row * height,
      rightCol:width-(clarifaiFace.right_col*width),
      bottomRow: height-(clarifaiFace.bottom_row * height)
    }    
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box:box});
  }

  onButtonSubmit = (event)=>{
    this.setState({imgURL:this.state.input})
    fetch('http://localhost:3001/imageurl',{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body:JSON.stringify({
        input:this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
        if(response){
          fetch('http://localhost:3001/image',{
            method:'PUT',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({
              id:this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count =>{
            this.setState(Object.assign(this.state.user,{entries:count}))  
          })
          .catch(console.log)



        }
        this.displayFaceBox(this.calculateFaceLocation(response))})
      .catch(err => console.log(err));
  }

  onInputChange=(event)=>{
    this.setState({input:event.target.value})
  }

  onRouteChange = (route)=>{
    if(route === 'signout'){
      this.setState(inintialState)
    }else if(route === 'home'){
      this.setState({isSignIn:true})
    }
    this.setState({route:route})
  }

  render(){
    const {isSignIn,imgURL,box,route} = this.state;
    return (
      <div className="App">
        <Particles className="particles"
          params={particlesOptions}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignIn={isSignIn}/>
        {
          route === 'home' ? 
          <div>
            <Logo/>
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <Facerecognition box={box} imageUrl={imgURL}/>
          </div>:
          (route === 'signout' ?
            <SignIn onRouteChange={this.onRouteChange}/>:
            route === 'signin' ?
            <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>:
            <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )  
        }
      </div>
    );
  }
}

export default App;
