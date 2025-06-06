const express = require('express');
const router = express.Router();

const fakeUser = {
  email: 'student@miuegypt.edu.eg',
  password: '12345678'
};

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email.endsWith('@miuegypt.edu.eg')) {
    return res.status(400).json({ message: 'Email must end with @miuegypt.edu.eg' });
  }

  if (email === fakeUser.email && password === fakeUser.password) {
    return res.status(200).json({ message: 'Login successful!' });
  } else {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
});

module.exports = router;
