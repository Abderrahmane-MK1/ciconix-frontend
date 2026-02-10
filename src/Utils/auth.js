import axiosInstance from './axiosInstance'


export const saveTokens = (data) => {
    console.log('Saving tokens:', { 
        hasAccessToken: !!data.access,
        hasRefreshToken: !!data.refresh 
    });
    
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    
    const expiresIn = data.expires_in || 3600; //set it to one hour if it is undefined
    const expiryTime = Date.now() + (expiresIn * 1000); // convert to ms * 1000
    localStorage.setItem('token_expiry', expiryTime);
    
    console.log('Tokens saved! Expires at:', new Date(expiryTime).toLocaleTimeString());
};

export const getTokens = () => {
    return {
        access_token: localStorage.getItem('access_token'),
        refresh_token: localStorage.getItem('refresh_token'),
        expiry: localStorage.getItem('token_expiry')
    };
};

export const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expiry');
    console.log('Tokens cleared');
};


export const isTokenValid = () => {
    const token = localStorage.getItem('access_token');
    const expiry = localStorage.getItem('token_expiry');
    
    if (!token) {
        console.log('No token found');
        return false;
    }
    
    if (!expiry) {
        console.log('No expiry time found');
        return false;
    }
    
    const isValid = Date.now() < parseInt(expiry);
    console.log('Token check:', isValid ? 'Valid' : 'Expired');
    return isValid;
};

export const refreshToken = async () => {
    console.log('token refresh');
    
    try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
            console.log('No refresh token available');
            throw new Error('No refresh token');
        }
        
        const response = await axios.post('/api/token/refresh/', {
            refresh: refreshToken
        });
        
        console.log('Refresh successful!');
        
        saveTokens({
            access: response.data.access,
            refresh: response.data.refresh,
            expires_in: response.data.expires_in
        });
        
        return response.data.access;
        
    } catch (error) {
        console.error('Refresh failed:', error.message);
        
        // If refresh fails, clear everything and redirect to login
        clearTokens();
        window.location.href = '/login';
        
        throw error;
    }
};

export const getValidToken = async () => {
    console.log('Getting valid token...');
    
    // Simple check first
    if (isTokenValid()) {
        const token = localStorage.getItem('access_token');
        console.log('Using existing token');
        return token;
    }
    
    console.log('Token invalid/expired, trying refresh...');
    return await refreshToken();
};


export const checkAuth = () => {
    const isValid = isTokenValid();
    
    if (!isValid) {
        console.log('Not authenticated, redirecting to login');
        window.location.href = '/login';
        return false;
    }
    
    return true;
};

export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      await axiosInstance.post('/api/teams/logout/', {
        refresh: refreshToken  
      });
    }
  } catch (error) {
    console.log('Logout API error (still clearing local):', error);
  } finally {
    clearTokens();
    localStorage.removeItem('team_name');
    localStorage.removeItem('ctfd_team_id');
    console.log('User logged out');
    window.location.href = '/login';
  }
};