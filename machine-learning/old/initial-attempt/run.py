from extract_features_and_labels import extract_features_and_labels
from train import train

# features, labels = extract_features_and_labels(
#     '/Users/tintin/workspace/chloe-ting-extension/audio/05-20-20')

features, labels = extract_features_and_labels(
    '/Users/tintin/Downloads/UrbanSound8K/audio/foldx')

# print(labels)

train(features, labels)
