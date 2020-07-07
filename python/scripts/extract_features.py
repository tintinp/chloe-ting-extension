from os import path
import glob

# Filename convention
# Eg. 052020-0-10.wav
#   Video date      File Id     Label
#   05/20/20        10          0 = Chloe Ting's voice

LABEL_TO_TEXT = {
    '0': 'CHLOE_VOX',
    '1': 'BEEP',
    '2': 'BG_NOISE'
}


def parse_audio_label(fileName):
    decodedInfo = fileName.split('-')
    if (len(decodedInfo) == 3):


def extract_features(pathToFiles):
    dirPath = path.join(path.abspath(pathToFiles))
    dirName = path.basename(dirPath)

    for filePath in glob.glob(path.join(dirPath, '*.wav')):
        fileName = path.splitext(path.basename(filePath))[0]
        parse_audio_label(fileName)
