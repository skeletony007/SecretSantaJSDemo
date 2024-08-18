# JavaScript Secret Santa Pairing System Demo

Demonstration of [SecretSantaJS] using [Google Apps Script].

Visual example: <https://skeletony007.github.io/SecretSantaJSDemo/>

# Usage

1. **Clone this repo**

   ```
   git clone --recurse-submodules --depth 1 https://github.com/skeletony007/SecretSantaJSDemo.git
   cd SecretSantaJSDemo
   ```

2. **Create new Apps Script project using [clasp]**

   ```
   clasp create --type standalone
   cp .clasp.json .clasp.json.backup
   jq --arg pwd "$PWD" '. + {
     "rootDir": $pwd,
     "filePushOrder": [
       $pwd + "/SecretSantaJS/utils/json-validator.js",
       $pwd + "/SecretSantaJS/hat.js",
       $pwd + "/SecretSantaJS/secret-santa.js",
       $pwd + "/main.js"
     ],
     "timeZone": "Europe/London",
     "exceptionLogging": "STACKDRIVER",
     "runtimeVersion": "V8",
     "oauthScopes": [
       "https://www.googleapis.com/auth/drive.readonly",
       "https://www.googleapis.com/auth/drive"
     ]
   }' .clasp.json > .clasp.json.tmp && mv .clasp.json.tmp .clasp.json
   clasp push -f
   ```

# Test using [Node.js]

```
node <( \
    echo 'var state = '; \
    cat \
      secretsanta.json \
      SecretSantaJS/utils/json-validator.js \
      SecretSantaJS/hat.js \
      SecretSantaJS/secret-santa.js \
      main.js; \
    echo 'console.log(JSON.stringify(test(100)))' \
  )
```

[SecretSantaJS]: https://github.com/skeletony007/SecretSantaJS
[Google Apps Script]: https://developers.google.com/apps-script/
[clasp]: https://github.com/google/clasp
[Node.js]: https://github.com/nodejs/node
