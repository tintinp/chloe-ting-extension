# Chloe Ting Music Replacer [WIP]

Replace music inside Chloe Ting's workout video with music on another Chrome tab. Work in progress.

## Overview

#### Audio feature extraction

- [x] Explore audio characteristics
- [x] Determine DSP technique and features to extract for traning ML model

#### Data collection

- [x] Build Chrome extension for data collection
- [x] Extract features into csv file

#### Machine Learning

- [x] Experiment with parameters for each neural network layer
- [ ] Improve training dataset or feature selections (go back to data collection step)

#### Music replacer

- [ ] Build Chrome extension to handle multiple audio sources
- [ ] Apply trained model to the extension

#### Organizing README

- [ ] Move long technical descriptions into appropriate page
- [ ] Modify front-page README to just talk about using the extension and basic ideas of DSP and ML used

</br>

## Data collection with Chrome extension

Custom-made Chrome extension to capture audio from Youtube and process its audio signal using Meyda JavaScript package. We can choose tab from the dropdown menu to select tab with Chloe Ting's video.

![Data collection Chrome extension](/assets/readme/images/data_collection_ext.png)

The default sample length is 700ms. Meaning, audio features are calculated from that 700ms time frame, which counted as one dataset. Each dataset can be labeled by selecting one of the three button on top marked as `CHLOE`, `BEEP`, and `MUSIC`.

**Classes**

- Chloe's voice when explaining
- Beep is the countdown timer
- Music is background music during the workout

We can export features of datasets collected into a CSV file. More detail on usage, implementation, and further development can be found on `README.md` of `data-collection-chrome-extension`.

</br>

## Feature Extraction

Using Librosa python library, we can extract and plot audio characteristic. The purpose of this is not to classify any gender. The plot below is an observation from samples provided by [OpenSLR](http://www.openslr.org/12/). It can be seen that Chloe's vocal shared similar frequency intensity as the speech sample from OpenSLR.

**Comparing vocal frequencies between two vocals**
![Spectrogram comparing OpenSLR and Chloe's vocal](/assets/readme/images/spectrogram_compare.png)
[Listen to OpenSLR Sample](https://www.dropbox.com/s/fuzxq7gpnf820cv/84-121123-0001.flac?dl=0) </br>
[Listen to Chloe Sample](https://www.dropbox.com/s/zfekwto0x7o19hv/052020-0-11.wav?dl=0)

By extracting these frequency signatures, we should be able to distinguish the difference between Chloe's vocal and music.

### Extraction

The goal is to extract audio features from Youtube and predict using trained model inside Chrome extension, hence using JavaScript library, Meyda. Therefore, to minimize unknown factors for the purpose of this prototype, feature extraction for training the model should also be extracted in the same manner. You can learn more about [Meyda here](https://meyda.js.org/). <br/>

Many researches and projects use the property of [MFCC](http://practicalcryptography.com/miscellaneous/machine-learning/guide-mel-frequency-cepstral-coefficients-mfccs/). [This project](http://www.primaryobjects.com/2016/06/22/identifying-the-gender-of-a-voice-using-machine-learning/) highlights many features that can be used. Hence, I decided to explore as many features as I can get from using Meyda. From visualizing tons of plots in [Data Exploration python notebook](machine-learning/data_exploration.ipynb), I've chosen these features as they show promising value for training the neural network. **A comprehensive analysis can be found at [this Data Analysis python notebook](machine-learning/data_analysis.ipynb).**

1. **Spectral Flatness** - "Noisiness" of the sound and the delta of neighboring values
2. **MFCC** - 1st and 10th coefficient
3. **Power spectrum** Frequency amplitude (squared) from 15 different frequency bins

This gives 19 different features for a sample. 700ms per sample.

### Examples of feature visualization

Shaded area indicated when Chloe is speaking. As she speaks, background music volume ducted. As a result, bass and subs at around 50Hz amplitude dropped down to almost 0.
![~50 Hz](/assets/readme/images/ps1.png)

Timer's beep has two pitches, one at 1000Hz and the other at 2000Hz. The plot below shows peaks in the 1000Hz bin.
![~1000 Hz](/assets/readme/images/ps23.png)

This first MFFC coefficient reflected lower frequency in the Mel scale. When Chloe is speaking, the coefficient ducted.
![First Mel's Coefficient](/assets/readme/images/mfcc1.png)

The diagram below shows variation in spectral flatness. [Meyda](https://meyda.js.org/audio-features) defines this as _how noisy a sound is. For example a pure sine wave will have a flatness that approaches 0.0, and white noise will have a flatness that approaches 1.0_. When Chloe is speaking, there seems to be high fluctuation in this value.
![Spectral Flatness](/assets/readme/images/spectral_flatness.png)

</br>

## Machine Learning

Using TensorFlow to implement a neural network model with three layers. The model is trained with Python TensorFlow2 Keras Sequential model. Code and analysis of the first training can be found in [this python notebook](machine-learning/training.ipynb).

### Neural network layers

From multiple researches and trials, a good starting point for number of hidden layers for data that has arbitary decision boudary could be 2. More in-depth details can found at [Heaton Research](https://www.heatonresearch.com/2017/06/01/hidden-layers.html). Moreover, I followed this guideline from Heaton Rearch:

1. The number of hidden neurons should be between the size of the input layer and the size of the output layer.
2. The number of hidden neurons should be 2/3 the size of the input layer, plus the size of the output layer.
3. The number of hidden neurons should be less than twice the size of the input layer.

There are 19 inputs (features) and 3 outputs (class), total of 22. Two-third of 22 is about 14-15 hidden neurons. Therefore, I experimented with different number of neurons and decided to go with 15 neurons in the first hidden layer and 8 neurons in the second hidden layer. Activation function on both layers are [relu](https://towardsdatascience.com/activation-functions-neural-networks-1cbd9f8d91d6). The last output activation function is `softmax` so the three neurons will range of 0-1 and sum of those three will equal to 1.

![Neural network diagram 08/02/20](/assets/readme/images/neural-network-diagram.png)

### Cost function

#### Model Loss of first trained model 08/02/20

![Model loss from 08/02/20](/assets/readme/images/model-loss-1.png)

#### Accuracy

Currently, the model is trained with 4949 datasets with training accuracy of 95% and validation accuracy of 90%

</br>

## Chrome extension with trained ML model

**Work in progress!**

</br>

## References

### TensorFlow

[TensorFlow Graph](https://adventuresinmachinelearning.com/python-tensorflow-tutorial/) <br/>
[Hidden Layer, Robert Keim](https://www.allaboutcircuits.com/technical-articles/how-many-hidden-layers-and-hidden-nodes-does-a-neural-network-need/) <br/>
[Hidden Layer Heaton Research](https://www.heatonresearch.com/2017/06/01/hidden-layers.html) <br/>
[Building Neural Network](https://towardsdatascience.com/building-your-first-neural-network-in-tensorflow-2-tensorflow-for-hackers-part-i-e1e2f1dfe7a0) <br/>
[Deep Learning Stanford CS230](https://cs230.stanford.edu/) <br/>
[Feature Scaling](https://www.analyticsvidhya.com/blog/2020/04/feature-scaling-machine-learning-normalization-standardization/) <br/>
[Activation Functions](https://towardsdatascience.com/activation-functions-neural-networks-1cbd9f8d91d6)

### Audio feature extraction

[Urban Sound Classification](https://www.kdnuggets.com/2016/09/urban-sound-classification-neural-networks-tensorflow.html) <br/>
[Gender Classifier](https://github.com/jurgenarias/Portfolio/blob/master/Voice%20Classification/Code/Gender_Classifier/Gender_Classifier_NN.ipynb) <br/>
[Gender Classifier Techniques](http://www.primaryobjects.com/2016/06/22/identifying-the-gender-of-a-voice-using-machine-learning/) <br/>
[Music Genre Classification](https://nbviewer.jupyter.org/github/mdeff/fma/blob/outputs/usage.ipynb) <br/>
[DSP Background - Deep Learning for Audio Classification p.1](https://www.youtube.com/watch?v=Z7YM-HAz-IY) <br/>
[MFCC Tutorial](http://practicalcryptography.com/miscellaneous/machine-learning/guide-mel-frequency-cepstral-coefficients-mfccs/)

### WebAPI audio

[YouTube Controller Extension](https://github.com/maroun-baydoun/youtube-controller-extension) <br/>
[Live Audio MFCC](https://github.com/pulakk/Live-Audio-MFCC)

### WebRTC peer connection

[WebRTC Video Broadcast](https://gabrieltanner.org/blog/webrtc-video-broadcast) <br/>
[WebRTC Peer Connection Setup](https://github.com/webrtc/samples/blob/gh-pages/src/content/peerconnection/pc1/js/main.js)
[WebRTC Samples](https://webrtc.github.io/samples/) <br/>
[WebRTC Stream Video](https://webrtc.github.io/samples/src/content/capture/video-video/)
