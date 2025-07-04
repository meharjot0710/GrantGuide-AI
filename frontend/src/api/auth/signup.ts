const signup=async (name:string ,email: string, password: string, address:string): Promise<string> => {
    console.log('Signing up with:', name, email, address);
    const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, address }),
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
        throw new Error('Signup failed');
    }
    
    const data = await response.json();
    localStorage.setItem('token', data.token);
    
    if(data.user.role === 'admin') {
        localStorage.setItem('role', 'admin');
    } else {
        console.log('User role:', data.user.role);
        localStorage.setItem('role', 'user');
    }
    
    console.log('Signup successful:', data);
    return data;
}
export default signup;