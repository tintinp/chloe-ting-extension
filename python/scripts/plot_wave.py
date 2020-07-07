import glob
import os
import librosa
import librosa.display
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.pyplot import specgram
# import tensorflow as tf


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
        plt.subplot(len(raw_sounds), 1, i)
        librosa.display.waveplot(np.array(f), sr=22050)
        plt.title(n.title(), fontsize=12)
        i += 1
    plt.suptitle('Figure 1: Waveplot', fontsize=16)
    plt.show()


def plot_specgram(sound_names, raw_sounds):
    i = 1
    fig = plt.figure()
    for n, f in zip(sound_names, raw_sounds):
        plt.subplot(len(raw_sounds), 1, i)
        specgram(np.array(f), Fs=22050)
        plt.title(n.title(), fontsize=12)
        i += 1
    plt.suptitle('Figure 2: Spectrogram', fontsize=16)
    plt.show()


def plot_log_power_specgram(sound_names, raw_sounds):
    i = 1
    fig = plt.figure()
    for n, f in zip(sound_names, raw_sounds):
        plt.subplot(len(raw_sounds), 1, i)
        D = librosa.amplitude_to_db(
            np.abs(librosa.stft(f))**2, ref=np.max)
        librosa.display.specshow(D, x_axis='time', y_axis='log')
        plt.title(n.title(), fontsize=12)
        plt.colorbar(format='%+2.0f dB')
        i += 1
    plt.suptitle('Figure 3: Log power spectrogram', fontsize=16)
    plt.show()


dir_path = os.path.dirname(os.path.realpath(__file__))
samples_path = os.path.abspath(os.path.join(dir_path, '..', '..', 'samples'))

sound_file_paths = [os.path.join(samples_path, 'exercise_intro_1.wav'),
                    os.path.join(samples_path, '1000hz.wav')]

sound_names = ['Exercise Intro 1', '1000 Hz']


def main():
    print('hello')
    raw_sounds = load_sound_files(sound_file_paths)
    plot_waves(sound_names, raw_sounds)
    plot_specgram(sound_names, raw_sounds)
    plot_log_power_specgram(sound_names, raw_sounds)


if __name__ == '__main__':
    main()
