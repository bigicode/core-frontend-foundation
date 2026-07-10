import { useState, useEffect } from "react";
import apiClient from "../../../services/apiClient";
import useAuth from "../../../hooks/useAuth";


function ProfilePage(){
    const { token } = useAuth();
    const [ profile, setProfile ] = useState(null);
    const [ loading, setLoading ] = useState (true);
    const [ error, setError ] = useState ('');


    useEffect (() => {
        
        const fetchProfile = async () => {
             console.log('fetchProfile called');
            try {
                const response = await apiClient.get('/users/profile');
                
                setProfile(response.data.data);
            }catch (error) {
                
                setError('Failed to load profile');

            } finally {
                setLoading(false);
            }
        };
         if (token) {
      fetchProfile();
    } else {
      setLoading(false);
      setError('Please log in');
    }
    }, [token]);
    if (loading) return <div className="auth-card"><p>Loading......</p></div>;
    if (error) return <div className="auth-card"><p className="message error">{error}</p></div>;

     return (
    <div className="auth-card">
      <h1 className="auth-title">Profile</h1>
      <p><strong>Email:</strong> {profile?.email}</p>
      <p><strong>Role:</strong> {profile?.role || 'user'}</p>
      <p><strong>User ID:</strong> {profile?.id}</p>
    </div>
  );
}

export default ProfilePage;