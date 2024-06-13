const Hapi = require('@hapi/hapi');
const tfjs = require('@tensorflow/tfjs-node');

function loadModel() {
    const modelUrl = "file://models/model.json";
    // return tfjs.loadLayersModel(modelUrl);
    return tfjs.loadGraphModel(modelUrl);

  }

  function predict(model, imageBuffer) {
    const tensor = tfjs.node
      .decodeJpeg(imageBuffer)
      .resizeNearestNeighbor([150, 150])
      .expandDims()
      .toFloat();
   
    return model.predict(tensor).data();
  }


 
(async () => {
  // load and get machine learning model
  const model = await loadModel();
  console.log('model loaded!');
 
  // initializing HTTP server
  const server = Hapi.server({
    host: process.env.NODE_ENV !== 'production' ? 'localhost': '0.0.0.0',
    port: 3000
  });
 
  server.route({
    method: 'POST',
    path: '/predicts',
    handler: async (request) => {
      // get image that uploaded by user
      const { image } = request.payload;
      // do and get prediction result by giving model and image
      const predictions = await predict(model, image);
      // get prediction result
      const [paper, rock] = predictions;
 
      if (paper) {
        return { result: 'paper' };
      }
 
      if (rock) {
        return { result: 'rock' };
      }
 
      return { result: 'scissors' };
    },
    // make request payload as `multipart/form-data` to accept file upload
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
      }
    }
  });
 
  // running server
  await server.start();
 
  console.log(`Server start at: ${server.info.uri}`);
})();