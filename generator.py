pweqpw_template = open("pweqpw.template").read()
pweqpl_template = open("pweqpl.template").read()
tictactoe_template = open("tictactoe.template").read()

content = ""

for item in range(0,4):
    tr = pweqpw_template.replace('{{index}}', str(item)).replace('{{indexp1}}', str(item+1))
    content = content + tr

for item in range(0,5):
    tr = pweqpl_template.replace('{{index}}', str(item)).replace('{{indexp1}}', str(item+1))
    content = content + tr

result = tictactoe_template.replace('{{content}}', content)

compiled = open("ticktactoe.compiled.code", 'w')
compiled.write(result)
compiled.close()