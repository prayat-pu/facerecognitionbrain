const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '138d3992cd6e4a4f9307f9abdb7a7775'
   });



const handleImageApiCall = (req,res)=>{
    app.models.initModel({id: Clarifai.FACE_DETECT_MODEL})
   .then(generalModel => {
     return generalModel.predict(req.body.input);
   }).then(data=>{res.json(data)})
   .catch(error=>res.status(400).json('unable to work with api.'))
}

const handleImage = (req,res,db)=>{
    const {id} = req.body;
    db('users').where('id','=',id).increment('entries',1)
    .returning('entries').then(entries=>res.json(entries[0]))
    .catch(err=>res.status(400).json("unable to get entries."))
}

module.exports = {
    handleImage,
    handleImageApiCall
};