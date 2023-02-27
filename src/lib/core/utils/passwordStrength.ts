// Password strengths
const enum PasswordStrengthLevels {
    Short = "Short",
    Common = "Common",
    Weak = "Weak",
    Good = "Good",
    Strong = "Strong",
    VeryStrong = "Very strong"
}

type PasswordStrength = PasswordStrengthLevels;


// Expected length of all passwords
const DefaultMinimumLength = 8;

// Regex to check for a common password string - all based on 5+ length passwords
const commonPasswordPatterns = /passw.*|12345.*|09876.*|qwert.*|asdfg.*|zxcvb.*|footb.*|baseb.*|drago.*/;

//
// Checks if the given password matches a set of common password
//
async function isPasswordCommon(password: string): Promise<boolean> {
    return commonPasswordPatterns.test(password);
}

//
// Returns the strength of the current password
//
async function checkPasswordStrength(password: string, minimumLength?: number): Promise<PasswordStrength> {

    // Build up the strenth of our password
    let numberOfElements = 0;
    numberOfElements = /.*[a-z].*/.test(password) ? ++numberOfElements : numberOfElements;      // Lowercase letters
    numberOfElements = /.*[A-Z].*/.test(password) ? ++numberOfElements : numberOfElements;      // Uppercase letters
    numberOfElements = /.*[0-9].*/.test(password) ? ++numberOfElements : numberOfElements;      // Numbers
    numberOfElements = /[^a-zA-Z0-9]/.test(password) ? ++numberOfElements : numberOfElements;   // Special characters (inc. space)

    // Assume we have a poor password already
    let currentPasswordStrength = PasswordStrengthLevels.Short;

    // Check then strenth of this password using some simple rules
    if (password === null || password.length < (minimumLength || DefaultMinimumLength)) {
        currentPasswordStrength = PasswordStrengthLevels.Short;
    } else if (await isPasswordCommon(password) === true) {
        currentPasswordStrength = PasswordStrengthLevels.Common;
    } else if (numberOfElements === 0 || numberOfElements === 1 || numberOfElements === 2) {
        currentPasswordStrength = PasswordStrengthLevels.Weak;
    } else if (numberOfElements === 3 || password.length<10) {
        currentPasswordStrength = PasswordStrengthLevels.Good;
    } else if(password.length<12) {
        currentPasswordStrength = PasswordStrengthLevels.Strong;
    } else {
        currentPasswordStrength = PasswordStrengthLevels.VeryStrong;
    }

    // Return the strength of this password
    return currentPasswordStrength;
}


export default checkPasswordStrength;
export { PasswordStrengthLevels };
export type { PasswordStrength };