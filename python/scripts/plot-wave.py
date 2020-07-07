import glob
import os
import librosa
import librosa.display
import numpy as np
import matplotlib.pyplot as plt
# import tensorflow as tf
from matplotlib.pyplot import specgram


def load_sound_files(file_paths):
    raw_sounds = []
    for fp in file_paths:
        X, sr = librosa.load(fp)
        raw_sounds.append(X)
    return raw_sounds


def plot_waves(sound_names, raw_sounds):
    i = 1
    fig = plt.figure()
    for n, f in zip(sound_names, raw_sounds):
        plt.subplot(3, 1, i)
        librosa.display.waveplot(np.array(f), sr=22050)
        plt.title(n.title(), fontsize=12)
        i += 1
    plt.suptitle('Figure 1: Waveplot', fontsize=16)
    plt.show()


def plot_specgram(sound_names, raw_sounds):
    i = 1
    fig = plt.figure()
    for n, f in zip(sound_names, raw_sounds):
        plt.subplot(3, 1, i)
        specgram(np.array(f), Fs=22050)
        plt.title(n.title(), fontsize=12)
        i += 1
    plt.suptitle('Figure 2: Spectrogram', fontsize=16)
    plt.show()


def plot_log_power_specgram(sound_names, raw_sounds):
    i = 1
    fig = plt.figure(figsize=(25, 60), dpi=900)
    for n, f in zip(sound_names, raw_sounds):
        plt.subplot(3, 1, i)
        D = librosa.logamplitude(np.abs(librosa.stft(f))**2, ref_power=np.max)
        librosa.display.specshow(D, x_axis='time', y_axis='log')
        plt.title(n.title())
        i += 1
    plt.suptitle('Figure 3: Log power spectrogram',
                 x=0.5, y=0.915, fontsize=18)
    plt.show()


sound_file_paths = ['/Users/tintin/Desktop/exercise_intro_1.wav',
                    '/Users/tintin/Desktop/1000hz.wav']

sound_names = ['Exercise Intro 1', '1000 Hz']


def main():
    print('hello')
    raw_sounds = load_sound_files(sound_file_paths)
    plot_waves(sound_names, raw_sounds)
    plot_specgram(sound_names, raw_sounds)


if __name__ == '__main__':
    main()
