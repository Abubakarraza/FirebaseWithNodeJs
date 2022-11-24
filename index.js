const express = require('express');
const cors = require('cors');
const { db } = require('./config');
const { FieldValue } = require('firebase-admin/firestore');
const app = express();
app.use(cors());
app.use(express.json());
const userRef = db.collection('Users');
const citiesRef = db.collection('cities');
app.post('/', async (req, res) => {
  const data = req.body;
  const response = await userRef.add(data);
  const idData = await userRef
    .doc(response.id)
    .update({ id: response.id, timestamp: FieldValue.serverTimestamp() });
  if (response && idData) {
    res.send({ message: 'User is created' });
  }
});
app.patch('/update/:id', async (req, res) => {
  const { name, rollNo } = req.body;
  const id = req.params.id;
  //   console.log('🚀 ~ file: index.js ~ line 18 ~ app.patch ~ para', para);
  try {
    const response = await userRef.doc(id).update({ name, rollNo });
    if (response) {
      res.send({ message: 'User is Updated' });
    } else {
      res.send({ message: 'Something is wrong' });
    }
  } catch (error) {
    console.log(error);
  }
});
app.patch('/updateStudent', async (req, res) => {
  const { email, phone } = req.body;
  try {
    const response = await userRef.doc('L6wZfsRZQJoiqXV7vPsH').update({
      personalData: {
        email,
      },
    });
    if (response) {
      res.send({ message: 'User is updated' });
    } else {
      res.send('Something is wrong');
    }
  } catch (error) {
    console.log('Error:', error);
    res.send('InternalServerError');
  }
});
app.delete('/delData/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const response = await userRef.doc(id).delete();
    if (response) {
      res.send({ message: 'User is deleted' });
    } else {
      res.send({ message: 'Something went Wrong' });
    }
  } catch (error) {
    console.log(error);
    res.send({ message: 'Internal Server Error' });
  }
});
app.patch('/delRoll/:id', async (req, res) => {
  const data = req.body;
  try {
    const id = req.params.id;
    console.log('id:', id);
    const response = await userRef.doc(id).update({
      rollNo: FieldValue.delete(),
    });
    if (response) {
      res.send({ message: 'field is deleted' });
    }
  } catch (error) {
    console.log('Error:', error);
  }
});
app.patch('/subDel/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await userRef.doc('L6wZfsRZQJoiqXV7vPsH').update({
      personalData: {
        email: FieldValue.delete(),
      },
    });
    if (response) {
      res.send({ message: 'Field is delete' });
    } else {
      res.send({ message: 'Something is Wrong' });
    }
  } catch (error) {
    console.log('Error:', error);
    res.send({ message: 'Internal Server Error' });
  }
});
app.get('/getData', async (req, res) => {
  try {
    let allData = [];
    const response = await userRef.get();
    response.forEach((doc) => {
      allData.push(doc.data());
    });
    if (response) {
      res.send({ data: allData });
    } else {
      res.send({ message: 'Data is not found' });
    }
  } catch (error) {
    console.log(error);
    res.send({ message: 'Something is Wrong' });
  }
});
app.get('/getOneDoc/:id', async (req, res) => {
  let { id } = req.params;
  try {
    let data;
    const response = await userRef.doc(id).get();
    if (response.exists) {
      data = response.data();
      res.status(200).send({ message: data });
    } else {
      res.send('Data is not Found');
    }
  } catch (error) {
    res.status(404).send({ message: 'Internal Server Error' });
  }
});
app.get('/specificData', async (req, res) => {
  try {
    let allData = [];
    const response = await userRef.where('price', '>=', 12).get();
    // const response = await userRef.where('name', '==', 'Raza Ansari').get();
    response.forEach((doc) => {
      allData.push(doc.data());
    });
    res.send({ message: allData });
  } catch (error) {
    console.log('error:', error);
    res.status(404).send('Internal Server Error');
  }
});
app.patch('/timeStamp', async (req, res) => {
  const response = await userRef.doc('Name').update({
    timestamp: FieldValue.serverTimestamp(),
  });
  res.send({ message: response });
});
//SnapShot
app.post('/snapShot/:id', async (req, res) => {
  const { id } = req.params;
  try {
    db.collection('Users')
      .doc(id)
      .onSnapshot((docSnapshot) => {
        console.log(`Received doc snapshot: ${docSnapshot}`);
      });
  } catch (error) {}
});
app.get('/query', async (req, res) => {
  let allData = [];
  try {
    // const response = await userRef
    //   .where('subject', 'array-contains', 'persian')
    //   .get();
    // const response = await userRef
    //   .where('subject', 'array-contains-any', ['English', 'persian'])
    //   .get();
    // const response = await userRef.where('rollNo', 'in', [1, 2]).get();
    const response = await userRef
      .where('rollNo', '>', 0)
      .where('rollNo', '<', 3)
      .get();

    response.forEach((doc) => {
      console.log(doc.data());
      allData.push(doc.data());
    });

    if (response) {
      res.send({ message: allData });
    } else {
      res.send({ message: 'Something Went Wrong' });
    }
  } catch (error) {}
});
app.post('/city', async (req, res) => {
  try {
    await citiesRef.doc('SF').collection('landmarks').doc().set({
      name: 'Golden Gate Bridge',
      type: 'bridge',
    });
    await citiesRef.doc('SF').collection('landmarks').doc().set({
      name: 'Legion of Honor',
      type: 'museum',
    });
    await citiesRef.doc('LA').collection('landmarks').doc().set({
      name: 'Griffith Park',
      type: 'park',
    });
    await citiesRef.doc('LA').collection('landmarks').doc().set({
      name: 'The Getty',
      type: 'museum',
    });
    await citiesRef.doc('DC').collection('landmarks').doc().set({
      name: 'Lincoln Memorial',
      type: 'memorial',
    });
    await citiesRef.doc('DC').collection('landmarks').doc().set({
      name: 'National Air and Space Museum',
      type: 'museum',
    });
    await citiesRef.doc('TOK').collection('landmarks').doc().set({
      name: 'Ueno Park',
      type: 'park',
    });
    await citiesRef.doc('TOK').collection('landmarks').doc().set({
      name: 'National Museum of Nature and Science',
      type: 'museum',
    });
    await citiesRef.doc('BJ').collection('landmarks').doc().set({
      name: 'Jingshan Park',
      type: 'park',
    });
    await citiesRef.doc('BJ').collection('landmarks').doc().set({
      name: 'Beijing Ancient Observatory',
      type: 'museum',
    });
    index.js;
  } catch (error) {}
});
app.get('/getCity', async (req, res) => {
  try {
    let allData = [];
    const response = await db.collectionGroup('landmarks').limit(10).get();
    await response.docs.forEach((doc) => {
      allData.push(doc.data());
    });
    const data = allData.filter((data) => data.type == 'museum');
    if (allData.length) {
      res.send({ message: data });
    }
  } catch (error) {}
});
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running at port: ${port} `);
});
