const { loadModel, predict } = require('../utils/tfutil');
const {storeData, getData} = require('../utils/firestore');
const {v4 : uuidv4} = require('uuid')

module.exports = {
    getPrediction: async (req, res) => {
        try {
            const model = await loadModel();
            if(req.file) {
                    const image = req.file.buffer;
                    const predictions = await predict(model, image);
                    let result = "", suggestion = "";
                    if(predictions > 0.5){
                        result = "Cancer"; suggestion = "Segera periksa ke dokter!"
                    } else{
                        result = "Non-cancer"; suggestion = "Anda aman dari kanker"
                    } 
                    const file = req.file
                    const fileSize = file.size / 1024 / 1024;
                    if (fileSize > 1){
                        return res.status(400).json({
                            status: "fail",
                            message: "Payload content length greater than maximum allowed: 1000000"
                        })
                    } 
                    const id = uuidv4();
                    const createdAt = new Date().toISOString();
                    const data = {
                        id,
                        result,
                        suggestion,
                        createdAt
                    }
                    await storeData(id, data);
                    return res.status(200).json({
                        status: "success",
                        message: "Model is predicted successfully",
                        data
                    })
            } else {
                throw new Error('error')
            }
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                status: "fail",
                message: "Terjadi kesalahan dalam melakukan prediksi"                    
            })
        }
    },
    
    getAllPredictions: async(req, res) => {
        try {
            const data = await getData();
            if (!data){
                return res.status(404).json({
                    message: "data not found"
                })
            }
            return res.status(200).json({
                status: "success",
                data
            })
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                status: "fail",
                message: "Terjadi kesalahan dalam melakukan prediksi"                    
            })           
        }
    }
}