import { useState, useEffect } from "react";
import apiClient from "../services/apiClient";


function useAuth () {
    const [ token, setToken ] = useState (localStorage.getItem('authToken') || null);
    const [ user, setUser ] = useState (null);
    const [ loading, setLoading ] = useState(true);

    useEffect (() => {
        const fetchUser = async () => {
            if (!token){
                setLoading(false);
                return;
            }
            try{
                const response = await apiClient.get('/users/profile');
                setUser(response.data.data);
            }catch(error) {
                if (error.response?.status === 401){
                    localStorage.removeItem('authToken');
                    setToken (null);
                } else {
                    console.log('Non auth error')
                }

            }finally{
                setLoading(false);
            }
            
        };

        fetchUser();
    }, [token]);




    const login = (newToken) =>{
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
    };

    const logout = () =>{
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
    };

    return {
        token, 
        user, 
        login, 
        logout, 
        isAuthenticated: !!token
    };
    }

    export default useAuth