pweqpw_template = open("pweqpw.template").read()
pweqpl_template = open("pweqpl.template").read()
pleqpl_template = open("pleqpl.template").read()
tictactoe_template = open("tictactoe.template").read()
comb_template = open("comb.template").read()

content = ""

for item in range(0,4):
    tr = pweqpw_template.replace('{{index}}', str(item)).replace('{{indexp1}}', str(item+1))
    content = content + tr

for item in range(0,5):
    tr = pweqpl_template.replace('{{index}}', str(item)).replace('{{indexp1}}', str(item+1))
    content = content + tr

for item in range(0,4):
    tr = pleqpl_template.replace('{{index}}', str(item)).replace('{{indexp1}}', str(item+1))
    content = content + tr

result = tictactoe_template.replace('{{content}}', content)

comb = ""
for item in range(0,8):
    tr = comb_template.replace('{{count}}', str(item)).replace('{{comb}}', str(item))
    comb = comb + tr

result = result.replace('{{combs}}', comb)

compiled = open("tictactoe.compiled.code", 'w')
compiled.write(result)
compiled.close()