import { toast } from 'react-toastify';


const baseConfig = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark"
};

export const showToast = {
  success: (message, customConfig = {}) => {
    toast.success(message, { ...baseConfig, ...customConfig });
  },
  
  error: (message, customConfig = {}) => {
    toast.error(message, { 
      ...baseConfig, 
      autoClose: 5000,
      ...customConfig 
    });
  },
  
  info: (message, customConfig = {}) => {
    toast.info(message, { ...baseConfig, ...customConfig });
  },
  
  warning: (message, customConfig = {}) => {
    toast.warn(message, { ...baseConfig, ...customConfig });
  },

  // Untuk kebutuhan render custom JSX di dalam toast
  custom: (jsxContent, customConfig = {}) => {
    toast(jsxContent, { ...baseConfig, ...customConfig });
  }
};
