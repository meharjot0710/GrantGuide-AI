const login = async (email: string, password: string): Promise<string> => {
    console.log('Logging in with:', email, password);
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
    console.log('Response status:', response.status);
  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token);
  if(data.user.role === 'admin') {
    localStorage.setItem('role', 'admin');
  } else {
    console.log('User role:', data.user.role);
    localStorage.setItem('role', 'user');
  }
  console.log('Login successful:', data);
  return data;
}
export default login;