const functions = require("firebase-functions");
var admin = require("firebase-admin");
const cors = require('cors')({origin: true});

var serviceAccount = require("./vicon-service-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});


exports.customAuth = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        console.log(req.body);
        const uid = req.body.username;
        const password = req.body.password;
        const referencePassword = 'gafafi123';

        const db = getFirestore();
        const cityRef = db.collection('usuarios').doc(req.body.username);
        const doc = await cityRef.get();
        if (!doc.exists) {
            console.log('No such document!');
            res.status(500).send('No se encontro un usuario con este nombre de usuario.');
        } else {
            functions.logger.info('Document data:', doc.data());
            if (referencePassword === password) {
                getAuth()
                .createCustomToken(uid)
                .then((customToken) => {
                  functions.logger.info('Send token back to client');
                  res.send(customToken);
                })
                .catch((error) => {
                  functions.logger.info('Error creating custom token:', error);
                  res.status(500).send('Error creando el token personalizado');
                });
            } else {
                res.status(500).send('Contraseña incorrecta.');
            }
        }
    });
  });
  