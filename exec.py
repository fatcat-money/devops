# reads a cli input string
import json
import sys

def main():
    inpt = sys.argv[1]

    # parses the json inpt string
    inpt = json.loads(inpt)

    print(inpt)
    print('id', inpt['id'])
    create_file(inpt['id'])

# creates a copy of the example.beancount file with the id as the name
def create_file(id):
    with open('example.beancount', 'r') as f:
        with open(id + '.beancount', 'w') as f2:
            f2.write(f.read())

main()
