pweqpw_template = open("pweqpw.template").read()
pweqpl_template = open("pweqpl.template").read()

result = ""

for item in range(0,4):
    tr = pweqpw_template.replace('{{index}}', str(item)).replace('{{indexp1}}', str(item+1))
    result = result + tr

for item in range(0,5):
    tr = pweqpl_template.replace('{{index}}', str(item)).replace('{{indexp1}}', str(item+1))
    result = result + tr

compiled = open("ticktactoe.compiled.code", 'w')
compiled.write(result)
compiled.close()