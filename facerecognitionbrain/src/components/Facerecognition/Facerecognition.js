import './Facerecognition.css'
const Facerecognition = ({imageUrl,box})=>{
    return (
        <div className='center'>
            <div className='absolute mt2'>
                <img id='inputimage' width="500px" heigh="auto" alt="" src={imageUrl}/>
                <div className='bounding-box' style={{top:box.topRow,right:box.rightCol,bottom:box.bottomRow,left:box.leftCol}}></div>
            </div>
        </div>
    );
}

export default Facerecognition;