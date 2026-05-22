import jwt from
"jsonwebtoken";

import User from
"../models/User.js";

export const
authMiddleware =
async (
 req,
 res,
 next
) => {

try {

const authHeader =
req.headers.authorization;

if (
 !authHeader ||

 !authHeader.startsWith(
 "Bearer "
 )
) {

return res
.status(401)
.json({

message:
"No token ❌"

});

}

const token =
authHeader.split(
 " "
)[1];

const decoded =
jwt.verify(

 token,

 process.env
 .JWT_SECRET
);


// ONLY USER
const user =
await User
.findById(
 decoded.id
);

if (!user) {

return res
.status(401)
.json({

message:
"User not found ❌"

});

}


// FINAL USER
req.user = {

 ...user.toObject(),

 hospitalId:
 decoded.hospitalId
 || user.hospitalId
 || null,

 districtId:
 decoded.districtId
 || user.districtId
 || null,

 stateId:
 decoded.stateId
 || user.stateId
 || null,

 organizationId:
 decoded.organizationId
 || user.organizationId
 || null
};

console.log(
"FINAL USER:",
req.user
);

next();

}

catch (err) {

console.log(
"AUTH ERROR:",
err.message
);

return res
.status(401)
.json({

message:
"Invalid token ❌"

});

}

};