const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  signToken: function({ username, email, _id }) {
    const payload = { username, email, _id };

    const token = jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    console.log(token);
    return token;
  },
  authMiddleware: function({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
  
    // separate "Bearer" from "<tokenvalue>"
    if (req.headers.authorization) {
      token = token
        .split(' ')
        .pop()
        .trim();
    }
  
    // if no token, return request object as is
    if (!token) {
      return req;
    }
  
    try {
      // decode and attach user data to request object
    //   console.log(new Date(), 'a', token.substring(0,10), "...", token.substring(token.length-10, token.length));
    //   console.log(token);
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
    //   console.log('b', token.substring(token.length-10, token.length), data);
      req.user = data;
    } catch {
      console.log(new Date() + ' Invalid token');
    }
  
    // return updated request object
    // console.log("X", req.user);
    return req;
  }
};


// {
//     "data": {
//       "login": {
//         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoidGVzdGVyMiIsImVtYWlsIjoidGVzdDJAdGVzdC5jb20iLCJfaWQiOiI2MjFjZTVjNGI4ZGU2NjYxYTQxOWE1NDMifSwiaWF0IjoxNjQ2MDY2Mzc0LCJleHAiOjE2NDYwNzM1NzR9.sx0UW5IEbbhFSMNbxDVz4ZIVreqwlyzgacClLkG9-DY",
//         "user": {
//           "_id": "621ce5c4b8de6661a419a543"
//         }
//       }
//     }
//   }