template = open("pweqpw.template").read()
result = ""
for item in range(0,4):
    tr = template.replace('{{index}}', str(item)).replace('{{indexp1}}', str(item+1))
    result = result + tr
compiled = open("ticktactoe.compiled.code", 'w')
compiled.write(result)
compiled.close()