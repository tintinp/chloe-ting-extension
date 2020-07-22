# Chloe Ting Music Replacer [WIP]

Replace music inside Chloe Ting's workout video with music on another Chrome tab. Work in progress.

# Project Overview

## Audio feature extraction

[ ] Explore audio characteristics
[ ] Determine DSP technique
[ ] Choose features to extract for traning

## Data collection

[ ] Build Chrome extension for data collection
[ ] Extract features into csv file

## Machine Learning

[ ] Experiment with parameters for each neural network layer
[ ] Improve training dataset or feature selections (go back to data collection step)
[ ] Create accurate model

## Apply ML model

[ ] Build Chrome extension to handle multiple audio sources
[ ] Apply trained model to the extension

# Data collection with Chrome extension

Custom-made Chrome extension to capture audio from Youtube and process its audio signal using Meyda JavaScript package. We can choose tab from the dropdown menu to select tab with Chloe Ting's video. The default sample length is 700ms. Meaning, audio features are calculated from that 700ms time frame, which counted as one dataset. Each dataset can be labeled by selecting one of the three button on top marked as `CHLOE`, `BEEP`, `MUSIC`, where Chole is Chloe's voice when explaining, Beep is the countdown timer, and Music is background music during the workout. We can export data collected into a CSV file. More detail on usage, implementation, and further development can be found on `README.md` of `data-collection-chrome-extension`.

# Feature Extraction

Using Librosa python library, we can extract and plot audio characteristic. The following diagram shows power log spectrogram of each classification: Chloe, Beep, and Music.

The goal is to extract audio features from Youtube and predict using trained model inside Chrome extension, hence using JavaScript library, Meyda. Therefore, to minimize unknown factors for the purpose of this prototype, feature extraction for training the model should also be extracted in the same manner. You can learn more about Meyda [here].

From multiple research papers and projects, I've decided to go with these audio features:

1.
2.
3.
4.

## Extracting

## Extracting MCFF

## Extracting

# Machine Learning

Using TensorFlow to implement a neural network model with three layers. Total number of features is ... and total number of class is 3. The model training session is implemented with Python. Model can later be export and use to predict with TensorFlow JS.

## Neural network layers

## Cost function

[TBD]

## Accuracy

[TBD]

# Chrome extension with trained ML model

[TBD]

# References

## Sound classification Tutorial

https://www.kdnuggets.com/2016/09/urban-sound-classification-neural-networks-tensorflow.html

## TensorFlow Tutorial

https://adventuresinmachinelearning.com/python-tensorflow-tutorial/

# Overview

## Data collection

(insert diagram of waves)
(insert diagram of wave and example of choice of audio clip)
(file naming convention)

### Classification

0: Chloe Ting's Voice
1: Beep sound
2: Other background music

## Features Extraction

### Methods

(tensorflow and python code)

### Frequency

(insert FFT diagram of different class)
(mention the hypothesis to use these features on the fft to classify each audio)

## Neural Network

(what type)

### Configuration

(desicion and trial and errors)
(diagram of cost functions)

(batch size and samples batch info)

### Model

Input
X = [[audio_features_1], [audio_features_2], ..., [audio_features_n]]

Output
y = [[0, 0, 1], [1, 0, 0], ..., [0, 1, 0]]

X = np.array([[0,0], [0,1], [1,0], [1,1]])
y = np.array([ [0], [1], [1], [0]])

## Result

### Accuracy

## Integration with Chrome Extension

## Deploy to AWS

### Procedure

# Set up

Create a new virtual environment <br/>
`python3 -m venv --system-site-packages`

Activate virtual environment <br/>
`source ./venv/bin/activate`

Deactivate virtual environment <br/>
`deactivate`
