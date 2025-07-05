import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, TextField, Button, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';

const initialState = {
  name: 'Riya Sharma',
  userType: 'Student',
  region: 'Rajasthan',
  country: 'India',
  preferredLanguage: 'English',
  interests: ['AI', 'Cloud Computing', 'Skilling', 'Accessibility'],
  goals: 'Earn certification and apply for internships in tech',
  domainFocus: 'Assistive Tech, Education, Social Impact',
  projectStage: 'Learning',
  hasPrototype: false,
  grantTypeNeeded: ['Skilling', 'Certification', 'Mentorship'],
  techStack: ['Python', 'Azure', 'ML'],
};

const interestOptions = ['AI', 'Cloud Computing', 'Skilling', 'Accessibility'];
const grantTypeOptions = ['Skilling', 'Certification', 'Mentorship'];
const techStackOptions = ['Python', 'Azure', 'ML'];

export default function ProfileForm() {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field: string, value: string) => {
    setForm((prev) => {
      const arr = prev[field as keyof typeof prev] as string[];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter((v) => v !== value) };
      } else {
        return { ...prev, [field]: [...arr, value] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/user/update-info', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/chatbot');
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Complete Your Profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Name" name="name" value={form.name} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="User Type" name="userType" value={form.userType} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Region" name="region" value={form.region} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Country" name="country" value={form.country} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Preferred Language" name="preferredLanguage" value={form.preferredLanguage} onChange={handleChange} required />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Interests</Typography>
          {interestOptions.map((option) => (
            <FormControlLabel
              key={option}
              control={<Checkbox checked={form.interests.includes(option)} onChange={() => handleArrayChange('interests', option)} />}
              label={option}
            />
          ))}
          <TextField fullWidth margin="normal" label="Goals" name="goals" value={form.goals} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Domain Focus" name="domainFocus" value={form.domainFocus} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Project Stage" name="projectStage" value={form.projectStage} onChange={handleChange} required />
          <FormControlLabel
            control={<Checkbox checked={form.hasPrototype} onChange={() => setForm((prev) => ({ ...prev, hasPrototype: !prev.hasPrototype }))} />}
            label="Has Prototype"
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Grant Type Needed</Typography>
          {grantTypeOptions.map((option) => (
            <FormControlLabel
              key={option}
              control={<Checkbox checked={form.grantTypeNeeded.includes(option)} onChange={() => handleArrayChange('grantTypeNeeded', option)} />}
              label={option}
            />
          ))}
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Tech Stack</Typography>
          {techStackOptions.map((option) => (
            <FormControlLabel
              key={option}
              control={<Checkbox checked={form.techStack.includes(option)} onChange={() => handleArrayChange('techStack', option)} />}
              label={option}
            />
          ))}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 