# encoding=utf8
import names
import random

f = open("lmao.txt", "w")
classes = ["Chem", "Bio", "BCCalc", "AnalysisH", "APEnglish", "PhysicsAPC", "Astronomy"]
for i in range(0,50):
	cl = random.sample(classes,3)
	f.write(names.get_first_name() + "@" + names.get_last_name() + "@")
	for i in range(0,len(cl)-1):
		f.write(cl[i] + "@")
	f.write(cl[len(cl) - 1])	
	f.write("\n")

f.close()

