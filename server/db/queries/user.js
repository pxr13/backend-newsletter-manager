const db = require('../config');

const idExists = (existingId) => existingId.length !== 0;

const createUser = async ({ access_token, refresh_token }, { emailAddress }) => {
  const existingId = await db('user_account')
    .select('id')
    .where('email_address', emailAddress);

  if (idExists(existingId)) return existingId;

  return db('user_account').insert(
    {
      access_token,
      refresh_token,
      email_address: emailAddress
    },
    'id'
  );
};

const getRefreshToken = (id) =>
  db('user_account')
    .select('refresh_token')
    .where('id', id);

const updateUser = ({ refresh_token, access_token }, id) => {
  return db('user_account')
    .update({ refresh_token, access_token })
    .where('id', id)
    .returning('access_token');
};

const addLabelToDb = ({ labelName, queries, id }) =>
  db('label').insert({ name: labelName, user_id: id }, 'id');

module.exports = {
  createUser,
  getRefreshToken,
  updateUser
};
