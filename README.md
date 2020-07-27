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

Many researches and projects use the property of [MFCC](http://practicalcryptography.com/miscellaneous/machine-learning/guide-mel-frequency-cepstral-coefficients-mfccs/). [This project](http://www.primaryobjects.com/2016/06/22/identifying-the-gender-of-a-voice-using-machine-learning/) highlights many features that can be used. Hence, I decided to explore as many features as I can get from using Meyda. From visualizing tons of plots, [Data Exploration](machine-learning/data_exploration.ipynb), I've chosen these features as they show promising value for training the neural network. **A comprehensive analysis can be found at [Data Analysis](machine-learning/data_analysis.ipynb).**

1. **Spectral Flatness** - "Noisiness" of the sound
2. **MFCC** - 1st and 10th coefficient
3. **Power spectrum** Frequency amplitude (squared) from 15 different frequency bins

This should give 18 different features for a sample. 700ms per sample.

### Examples of feature visualization

Shaded area indicated when Chloe is speaking. As she speaks, background music volume ducted. As a result, bass and subs at around 50Hz amplitude dropped down to almost 0.
![~50 Hz](/assets/readme/images/ps1.png)

Timer's beep has two pitches, one at 1000Hz and the other at 2000Hz. The plot below shows peaks in the 1000Hz bin.
![~1000 Hz](/assets/readme/images/ps23.png)

This first MFFC coefficient reflected lower frequency in the Mel scale. When Chloe is speaking, the coefficient ducted.
![First Mel's Coefficient](/assets/readme/images/mfcc1.png)

[Meyda](https://meyda.js.org/audio-features) defines this as _how noisy a sound is. For example a pure sine wave will have a flatness that approaches 0.0, and white noise will have a flatness that approaches 1.0_. When Chloe is speaking, there seems to be high fluctuation in this value.
![Spectral Flatness](/assets/readme/images/spectral_flatness.png)

</br>

## Machine Learning

Using TensorFlow to implement a neural network model with three layers. Total number of features is 21 (maybe 22 if include index of bin of max power spectrum) and total number of class is 3. The model training session is implemented with Python. Model can later be export and use to predict with TensorFlow JS.

### Neural network layers

[TBD]

### Cost function

[TBD]

### Accuracy

[TBD]

</br>

## Chrome extension with trained ML model

[TBD]

</br>

## References

### TensorFlow

https://adventuresinmachinelearning.com/python-tensorflow-tutorial/

### Audio feature extraction

https://www.kdnuggets.com/2016/09/urban-sound-classification-neural-networks-tensorflow.html
https://github.com/jurgenarias/Portfolio/blob/master/Voice%20Classification/Code/Gender_Classifier/Gender_Classifier_NN.ipynb
http://www.primaryobjects.com/2016/06/22/identifying-the-gender-of-a-voice-using-machine-learning/
https://www.youtube.com/watch?v=Z7YM-HAz-IY
http://practicalcryptography.com/miscellaneous/machine-learning/guide-mel-frequency-cepstral-coefficients-mfccs/

### WebAPI audio

https://github.com/maroun-baydoun/youtube-controller-extension
https://github.com/pulakk/Live-Audio-MFCC

### WebRTC peer connection

https://gabrieltanner.org/blog/webrtc-video-broadcast
https://github.com/webrtc/samples/blob/gh-pages/src/content/peerconnection/pc1/js/main.js
