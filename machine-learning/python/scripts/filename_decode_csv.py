from os import path
import glob
import argparse
import csv

parser = argparse.ArgumentParser(description='Decode filename to labels')
parser.add_argument('-d', '--dir', required=True, action='store',
                    help='path to dir containing audio files')
parser.add_argument('-o', '--outputDir', required=True, action='store',
                    help='result csv output dir path')

args = parser.parse_args()

LABEL_TO_TEXT = {
    '0': 'CHLOE_VOX',
    '1': 'BEEP',
    '2': 'BG_NOISE'
}

dirPath = path.join(path.abspath(args.dir))
dirName = path.basename(dirPath)
outputPath = path.abspath(args.outputDir)
outputFileName = path.join(outputPath, dirName + '.csv')

with open(outputFileName, 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['Dataset', 'Id', 'Label', 'Label Text'])
    for filePath in glob.glob(path.join(dirPath, '*.wav')):
        fileName = path.splitext(path.basename(filePath))[0]
        decoded = fileName.split('-')
        if (len(decoded) == 3):

            writer.writerow(
                [decoded[0], decoded[2], decoded[1], LABEL_TO_TEXT[decoded[1]]])

print('Output csv file generated ->', outputFileName)
