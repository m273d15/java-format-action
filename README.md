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
      uses: actions/checkout@v2
    - uses: m273d15/java-format-action@v1.1
      with:
        version: '1.7'
        dir: './java' # Optional default is './'
        pattern: '**/*.java' # Optional default is '**/*.java'
```
