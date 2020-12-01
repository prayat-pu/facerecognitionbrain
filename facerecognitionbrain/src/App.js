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
import Clarifai from'clarifai';

const app = new Clarifai.App({
  apiKey: '138d3992cd6e4a4f9307f9abdb7a7775'
 });

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

class App extends Component {
  constructor(){
    super();
    this.state = {
      input:'',
      imgURL:'',
      box:{},
      route:'signin',
      isSignIn:false
    }
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
    app.models.initModel({id: Clarifai.FACE_DETECT_MODEL})
      .then(generalModel => {
        return generalModel.predict(this.state.input);
      }).then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
      // .then(response => {
      //   // var concepts = response['outputs'][0]['data']['concepts']
      //   var concepts = response['outputs'][0]['data']['regions'][0]['region_info']['bounding_box']
      //   this.calculateFaceLocation(concepts);
      // })
  }

  onInputChange=(event)=>{
    this.setState({input:event.target.value})
  }

  onRouteChange = (route)=>{
    if(route === 'signout'){
      this.setState({isSignIn:false})
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
            <Rank/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <Facerecognition box={box} imageUrl={imgURL}/>
          </div>:
          (route === 'signout' ?
            <SignIn onRouteChange={this.onRouteChange}/>:
            route === 'signin' ?
            <SignIn onRouteChange={this.onRouteChange}/>:
            <Register onRouteChange={this.onRouteChange}/>
          )  
        }
      </div>
    );
  }
}

export default App;
