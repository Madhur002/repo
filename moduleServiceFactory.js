import { apiRequest } from "../../axios/apiRequest";
// const OBLIGATION_BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/v1/obligations`;
// Service factory for different modules
export const createModuleService = (moduleType) => {
  const getBaseUrl = () => {
    switch (moduleType) {
      case 'obligation':
        return `${process.env.REACT_APP_BACKEND_URL}/api/v1/obligations`;
      case 'indents':
        return '/api/indents';
      case 'incidents':
        return '/api/incidents';
      case 'ise-observation':
        return '/api/ise-observations';
      case 'self-certificate':
        return '/api/self-certificates';
      default:
        throw new Error(`Unsupported module type: ${moduleType}`);
    }
  };

  const getRepositoryEndpoint = () => {
    switch (moduleType) {
      case 'obligation':
        return '/repository';
      case 'indents':
        return '/repository';
      case 'incidents':
        return '/repository';
      case 'ise-observation':
        return '/repository';
      case 'self-certificate':
        return '/repository';
      default:
        return '/repository';
    }
  };

  const getExportEndpoint = () => {
    switch (moduleType) {
      case 'obligation':
        return '/export/excel';
      case 'indents':
        return '/export/excel';
      case 'incidents':
        return '/export/excel';
      case 'ise-observation':
        return '/export/excel';
      case 'self-certificate':
        return '/export/excel';
      default:
        return '/export/excel';
    }
  };

  return {
    // Get repository data with filters and pagination
    getRepository: async (params = {}) => {
      try {
        const queryParams = new URLSearchParams();
        
        // Add pagination params
        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);
        
        // Add filter params dynamically
        Object.keys(params).forEach(key => {
          if (key !== 'page' && key !== 'limit' && params[key]) {
            queryParams.append(key, params[key]);
          }
        });

        const response = await apiRequest(
          "GET",
          `${getBaseUrl()}${getRepositoryEndpoint()}?${queryParams.toString()}`
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Export data to excel
    exportToExcel: async (params = {}) => {
      try {
        const queryParams = new URLSearchParams();
        
        // Add filter params for export
        Object.keys(params).forEach(key => {
          if (key !== 'page' && key !== 'limit' && params[key]) {
            queryParams.append(key, params[key]);
          }
        });

        const response = await apiRequest(
          "GET",
          `${getBaseUrl()}${getExportEndpoint()}?${queryParams.toString()}`,
          null,
          { responseType: 'blob' }
        );
        
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        link.setAttribute('download', `${moduleType}_${timestamp}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        return true;
      } catch (error) {
        throw error;
      }
    }
  };
};
