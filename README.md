# chloe-ting-extension

WIP

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
