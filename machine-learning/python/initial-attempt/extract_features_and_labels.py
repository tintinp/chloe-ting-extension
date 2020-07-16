from os import path
import glob
import librosa
import numpy as np

# File name convention
# Eg. 052020-0-10.wav
#   Video date      File Id     Label
#   05/20/20        10          0 = Chloe Ting's voice

LABEL_TO_TEXT = {
    '0': 'CHLOE_VOX',
    '1': 'BEEP',
    '2': 'BG_NOISE'
}


def parse_audio_labels(file_path):
    file_name = path.splitext(path.basename(file_path))[0]
    decoded_info = file_name.split('-')
    return decoded_info[1]


def get_one_hot_labels(labels):
    n_labels = len(labels)
    n_unique_labels = len(np.unique(labels))
    label_array = np.zeros((n_labels, n_unique_labels))
    label_array[np.arange(n_labels), labels] = 1
    return label_array


def extract_features(file_path):
    X, sample_rate = librosa.load(file_path)
    # Short-time fourier transform
    stft = np.abs(librosa.stft(X))

    # MFCCS
    mfccs = np.mean(librosa.feature.mfcc(
        y=X, sr=sample_rate, n_mfcc=40).T, axis=0)

    # Chroma
    chroma = np.mean(librosa.feature.chroma_stft(
        S=stft, sr=sample_rate).T, axis=0)

    # Mel
    mel = np.mean(librosa.feature.melspectrogram(X, sr=sample_rate).T, axis=0)

    # Contrast
    contrast = np.mean(librosa.feature.spectral_contrast(
        S=stft, sr=sample_rate).T, axis=0)

    # Tonnetz
    tonnetz = np.mean(librosa.feature.tonnetz(
        y=librosa.effects.harmonic(X), sr=sample_rate).T, axis=0)

    return mfccs, chroma, mel, contrast, tonnetz


def extract_features_and_labels(path_to_file):
    dir_path = path.join(path.abspath(path_to_file))
    features, labels = np.empty((0, 193)), np.empty(0)

    for file_path in glob.glob(path.join(dir_path, '*.wav')):
        print(file_path)
        try:
            mfccs, chroma, mel, contrast, tonnetz = extract_features(file_path)
            sample_features = np.hstack(
                [mfccs, chroma, mel, contrast, tonnetz])
            features = np.vstack([features, sample_features])
            labels = np.append(labels, parse_audio_labels(file_path))
        except:
            print("Oops! Error found, skipping...")

    one_hot_labels = get_one_hot_labels(np.array(labels, dtype=np.int))
    return np.array(features), one_hot_labels
