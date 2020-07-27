import glob
import librosa
import librosa.display
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.pyplot import specgram
from os import path
import argparse

parser = argparse.ArgumentParser(description='Plot audio features')
parser.add_argument('-f', '--file', required=True, action='store',
                    help='path to audio file')
args = parser.parse_args()


def plot_wave(name, raw_sound):
    plt.figure(1)
    librosa.display.waveplot(np.array(raw_sound), sr=22050)
    plt.title(name.title(), fontsize=12)
    plt.suptitle('Figure 1: Waveplot', fontsize=16)


def plot_specgram(name, raw_sound):
    plt.figure(2)
    specgram(np.array(raw_sound), Fs=22050)
    plt.title(name.title(), fontsize=12)
    plt.suptitle('Figure 2: Spectrogram', fontsize=16)


def plot_log_power_specgram(name, raw_sound):
    plt.figure(3)
    amp = librosa.stft(raw_sound)**2
    print('stft dimension: ' + str(amp.shape))
    D = librosa.amplitude_to_db(
        np.abs(librosa.stft(raw_sound))**2, ref=np.max)
    librosa.display.specshow(D, x_axis='time', y_axis='log')
    plt.title(name.title(), fontsize=12)
    plt.colorbar(format='%+2.0f dB')
    plt.suptitle('Figure 3: Log power spectrogram', fontsize=16)


def main():
    file_path = path.join(path.abspath(args.file))
    file_name = path.basename(file_path)

    # Load audio
    raw_sound, sr = librosa.load(file_path)
    print('Ploting', file_name)
    print('Sampling rate:', sr)

    # Plot
    # plot_wave(file_name, raw_sound)
    # plot_specgram(file_name, raw_sound)
    plot_log_power_specgram(file_name, raw_sound)
    plt.show()


if __name__ == "__main__":
    main()
