

const logout = async () => {
  
  console.log('Logging out...');
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  console.log('Logout successful');
}
export default logout;