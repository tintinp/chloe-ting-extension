# Chloe Ting Music Replacer [WIP]

Replace music inside Chloe Ting's workout video with music on another Chrome tab. Work in progress.

## Overview

### Audio feature extraction

- [x] Explore audio characteristics
- [x] Determine DSP technique and features to extract for traning ML model

### Data collection

- [x] Build Chrome extension for data collection
- [ ] Extract features into csv file

### Machine Learning

- [x] Experiment with parameters for each neural network layer
- [ ] Improve training dataset or feature selections (go back to data collection step)

### Music replacer

- [ ] Build Chrome extension to handle multiple audio sources
- [ ] Apply trained model to the extension

### Organizing README

- [ ] Move long technical descriptions into appropriate page
- [ ] Modify front-page README to just talk about using the extension and basic ideas of DSP and ML used

## Data collection with Chrome extension

Custom-made Chrome extension to capture audio from Youtube and process its audio signal using Meyda JavaScript package. We can choose tab from the dropdown menu to select tab with Chloe Ting's video.

The default sample length is 700ms. Meaning, audio features are calculated from that 700ms time frame, which counted as one dataset. Each dataset can be labeled by selecting one of the three button on top marked as `CHLOE`, `BEEP`, `MUSIC`,

**Classes**

- Chloe's voice when explaining
- Beep is the countdown timer
- Music is background music during the workout

We can export data collected into a CSV file. More detail on usage, implementation, and further development can be found on `README.md` of `data-collection-chrome-extension`.

## Feature Extraction

Using Librosa python library, we can extract and plot audio characteristic. The purpose of this is not to classify any gender. The plot below is an observation from samples provided by [OpenSLR](http://www.openslr.org/12/). It can be seen that Chloe's vocal shared similar frequency intensity as the speech sample from OpenSLR.

**Sample from OpenSLr**
![OpenSLR vocal spectrogram](/assets/readme/images/OpenSLR_sample.png)
[Listen to sample](https://www.dropbox.com/s/fuzxq7gpnf820cv/84-121123-0001.flac?dl=0)

**Chloe Ting's voice**
![Chloe Ting's Sample](/assets/readme/images/logspectrogram_chloe_1.png)
[Listen to sample](https://www.dropbox.com/s/zfekwto0x7o19hv/052020-0-11.wav?dl=0)

_[TBD] More details on extracting and plotting with Librosa and matplotlib.pyplot [Link]_

From multiple research papers and projects (see reference section), I've decided to go with these audio features:

### Extraction

The goal is to extract audio features from Youtube and predict using trained model inside Chrome extension, hence using JavaScript library, Meyda. Therefore, to minimize unknown factors for the purpose of this prototype, feature extraction for training the model should also be extracted in the same manner. You can learn more about [Meyda here](https://meyda.js.org/).

### Extracting MCFF

### Extracting

## Machine Learning

Using TensorFlow to implement a neural network model with three layers. Total number of features is ... and total number of class is 3. The model training session is implemented with Python. Model can later be export and use to predict with TensorFlow JS.

### Neural network layers

[TBD]

### Cost function

[TBD]

### Accuracy

[TBD]

## Chrome extension with trained ML model

[TBD]

## References

### TensorFlow

https://adventuresinmachinelearning.com/python-tensorflow-tutorial/

### Audio feature extraction

#### Feature extraction

https://www.kdnuggets.com/2016/09/urban-sound-classification-neural-networks-tensorflow.html
https://github.com/jurgenarias/Portfolio/blob/master/Voice%20Classification/Code/Gender_Classifier/Gender_Classifier_NN.ipynb
http://www.primaryobjects.com/2016/06/22/identifying-the-gender-of-a-voice-using-machine-learning/

#### MFCC

https://www.youtube.com/watch?v=Z7YM-HAz-IY
http://practicalcryptography.com/miscellaneous/machine-learning/guide-mel-frequency-cepstral-coefficients-mfccs/

### WebAPI audio

https://github.com/maroun-baydoun/youtube-controller-extension
https://github.com/pulakk/Live-Audio-MFCC

### WebRTC peer connection

https://gabrieltanner.org/blog/webrtc-video-broadcast
https://github.com/webrtc/samples/blob/gh-pages/src/content/peerconnection/pc1/js/main.js
