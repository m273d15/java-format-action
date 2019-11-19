# Java Format Action
Checks whether code complies with the google java formatter.

```yml
on: [push]

jobs:
  check:
    runs-on: ubuntu-latest
    name: Check format
    steps:
    - name: Checkout
      uses: actions/checkout@v1
    - uses: m273d15/java-format-check@v1
      with:
        version: '1.7'
        dir: './java' # Optional default is './'
        pattern: '**/*.java' # Optional default is '**/*.java'
```
