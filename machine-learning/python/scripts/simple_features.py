import glob
import librosa
import librosa.display
import numpy as np
from os import path
import matplotlib.pyplot as plt
import sklearn
import argparse

parser = argparse.ArgumentParser(description='Plot audio features')
parser.add_argument('-f', '--file', required=True, action='store',
                    help='path to audio file')
args = parser.parse_args()

# Sampling rate = 22050
# FFT size = 512
# each frame = 512/22050 = ~23ms

FFT_SIZE = 512


def main():
    file_path = path.join(path.abspath(args.file))

    # Load audio
    raw_sound, sr = librosa.load(file_path)

    stft = np.abs(librosa.stft(
        y=raw_sound, n_fft=FFT_SIZE, hop_length=FFT_SIZE))
    power_spectrum = np.square(np.mean(stft.T, axis=0))
    bin_max_power = (np.where(power_spectrum == np.amax(power_spectrum)))
    print(bin_max_power)

    mfcc = librosa.feature.mfcc(y=raw_sound, sr=sr, n_mfcc=13)
    mean_mfcc = np.mean(mfcc.T, axis=0)

    spectral_centroid = librosa.feature.spectral_centroid(
        y=raw_sound, sr=sr, n_fft=FFT_SIZE, hop_length=FFT_SIZE)[0]
    mean_spectral_centroid = np.mean(
        sklearn.preprocessing.minmax_scale(spectral_centroid, axis=0))


if __name__ == '__main__':
    main()
