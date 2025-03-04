const bcrypt = require('bcrypt');

async function hashPassword(passwordToHash) {
    const saltRounds = 10;
    return bcrypt.hash(passwordToHash, saltRounds);
}

async function comparePasswords(password, hash) {
    try {
        const match = await bcrypt.compare(password, hash);
        return match;
    } catch (err) {
        console.error('Error comparing passwords', err);
        return false;
    }
} 

module.exports = { hashPassword, comparePasswords };