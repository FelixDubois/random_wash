from os import listdir
from os.path import isfile, join

from random import shuffle

import csv

washs_folder = './public/washs'
anciens_folder = './public/anciens'

# On récupère les anciens et les washs à partir des photos qui sont dans les dossiers
washs = [f for f in listdir(washs_folder) if isfile(join(washs_folder, f))]
anciens = [f for f in listdir(anciens_folder) if isfile(join(anciens_folder, f))]

# On verifier que ya bien autant de wash dans que d'anciens
assert(len(washs) == len(anciens) and "Il n'y à pas autant d'anciens que de washs. Si un ancien à plusieurs washs il faut le metre 2 fois dans sont dossier.")

print("Il y a", len(washs), "washs")

# On mélange les 2 listes
shuffle(washs)
shuffle(anciens)

fams = []
fields = ['fams', 'ancien_photo', 'wash_photo']
for i in range(len(anciens)):
    fams.append([
        anciens[i].split('.')[0], # Nums
        join("/anciens", anciens[i]), # Photo ancien
        join("/washs", washs[i]) # Photo Wash
    ])

print(fams)

with open('./public/fams.csv', 'w', newline='') as csvFile:
    writer = csv.writer(csvFile, fields)
    writer.writerows(fams)
