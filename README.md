# JavaScript Secret Santa Pairing System Demo

Various demonstrations of [SecretSantaJS].

# Table of Contents

<!--toc:start-->
- [JavaScript Secret Santa Pairing System Demo](#javascript-secret-santa-pairing-system-demo)
- [Table of Contents](#table-of-contents)
- [Usage Example - Website](#usage-example-website)
- [Usage Example - Apps Script](#usage-example-apps-script)
- [Test using Node.js](#test-using-nodejs)
<!--toc:end-->

# Usage Example - Website

URL: <https://skeletony007.github.io/SecretSantaJSDemo/>

# Usage Example - Apps Script

Using [Google Apps Script] and [clasp].

1. **Clone this repo**

   ```
   git clone --recurse-submodules --depth 1 https://github.com/skeletony007/SecretSantaJSDemo.git
   cd SecretSantaJSDemo
   ```

2. **Create new Apps Script project using [clasp]**

   ```
   clasp create --type standalone \
   && cp .clasp.json .clasp.json.backup \
   && jq --arg pwd "$PWD" '. + {
     "rootDir": $pwd,
     "filePushOrder": [
       $pwd + "/SecretSantaJS/utils/validateJson.js",
       $pwd + "/SecretSantaJS/Hat.js",
       $pwd + "/SecretSantaJS/SecretSantaParticipant.js",
       $pwd + "/SecretSantaJS/SecretSanta.js",
       $pwd + "/main.js"
     ],
   }' .clasp.json > .clasp.json.tmp && mv .clasp.json.tmp .clasp.json \
   && cp appsscript.json appsscript.json.backup \
   && jq '. + {
     "timeZone": "Europe/London",
     "exceptionLogging": "STACKDRIVER",
     "runtimeVersion": "V8",
     "oauthScopes": [
       "https://www.googleapis.com/auth/drive.readonly",
       "https://www.googleapis.com/auth/drive",
       "https://www.googleapis.com/auth/script.send_mail"
     ]
   }' appsscript.json > appsscript.json.tmp && mv appsscript.json.tmp appsscript.json \
   && clasp push -f
   ```

# Test using Node.js

Using [Node.js], execute the following command:

```
node <( \
    echo 'var data = '; \
    cat \
      example-data.json \
      SecretSantaJS/utils/validateJson.js \
      SecretSantaJS/Hat.js \
      SecretSantaJS/SecretSantaParticipant.js \
      SecretSantaJS/SecretSanta.js \
      main.js; \
    echo 'console.log(JSON.stringify(test(100)))' \
  )

```

[SecretSantaJS]: https://github.com/skeletony007/SecretSantaJS
[Google Apps Script]: https://developers.google.com/apps-script/
[clasp]: https://github.com/google/clasp
[Node.js]: https://github.com/nodejs/node
