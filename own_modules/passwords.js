stringAlphaNum = "";
v_intervals = [[48,57],[65,90],[97,122]] //ASCII code

for(let interval of v_intervals){
    for(let i=interval[0]; i<=interval[1]; i++)
        stringAlphaNum+=String.fromCharCode(i)
}

console.log(stringAlphaNum);

/**
 * Generates a token for the password.
 * @param {number} n - The length of the token (number of characters).
 * @return {string} The password token.
 */
function generateToken(n){
    let token="";
    for (let i=0; i<n; i++){
        token+=stringAlphaNum[Math.floor(Math.random()*stringAlphaNum.length)]
    }
    return token;
}

module.exports.generateToken=generateToken;