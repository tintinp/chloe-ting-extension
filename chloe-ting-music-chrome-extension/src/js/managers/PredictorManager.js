import * as tf from '@tensorflow/tfjs'

class PredictorManager {
  constructor() {
    this.model = null
  }

  async loadModel(modelPath) {
    this.model = await tf.loadLayersModel(modelPath)
  }

  predict(features) {
    console.log(features)
    // const prediction = this.model.predict(features)
    // console.log(prediction)
  }
}

export default PredictorManager
