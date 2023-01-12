import json


f = open("logCopy.txt", "r")
fJson = json.loads(f.read())

updated = fJson

for x in fJson.keys():
    for y in fJson[x].keys():
        print(y)
        if y != "stops" and y != "options":
            updated[x][y] = fJson[x][y]
        else:
            updated[x][y] = 0

print(updated)

newf = open('updatedLog.txt', 'w')

newf.write(json.dumps(updated))

newf.close()
