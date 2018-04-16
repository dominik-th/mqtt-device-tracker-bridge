module.exports = {

  port: 3000,

  secret: 'password',

  mqtt: {
    host: 'localhost',
    // username: '',
    // password: ''
  },

  // if empty, any devices will be accepted
  allowedDevices: [
    'device1',
    'device2'
  ]

};
