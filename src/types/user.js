/**
 * @typedef {Object} UserData
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string[]} roles
 */

export const userSchema = {
  /** * @param {any} data 
   * @returns {{success: boolean, data?: UserData}} 
   */
  safeParse: (data) => {
    if (typeof data !== "object" || data === null) return { success: false };

    const hasValidName = typeof data.name === "string";
    const hasValidUsername = typeof data.username === "string";
    const hasValidEmail = typeof data.email === "string" && data.email.includes("@");
    const hasValidRoles = Array.isArray(data.roles) && data.roles.every(r => typeof r === "string");

    if (!hasValidName || !hasValidUsername || !hasValidEmail || !hasValidRoles) {
      return { success: false };
    }

    return { success: true, data: data };
  }
};