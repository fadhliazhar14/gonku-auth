// Aturan Regex standar untuk email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const UserDetailsModel = {
  initialValues: {
    username: "",
    name: "",
    email: ""
  },

  validateField(fieldName, value) {
    switch (fieldName) {
      case "username":
        if (!value.trim()) return "Username is required";
        if (value.trim().length < 3 || value.trim().length > 50) return "Username must be between 3 and 50 characters";
        return "";
      
        case "name":
        if (!value.trim()) return "Nama is required";
        if (value.trim().length < 3 || value.trim().length > 50) return "Name must be between 3 and 50 characters";
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        if (value.trim().length > 100) return "Email must not exceed 100 characters";
        if (!EMAIL_REGEX.test(value)) return "Email is not in valid format";
        return "";

      default:
        return "";
    }
  },

  validateAll(values) {
    const errors = {};
    
    Object.keys(values).forEach((field) => {
      const errorMessage = this.validateField(field, values[field]);
      if (errorMessage) {
        errors[field] = errorMessage;
      }
    });

    return errors;
  }
};