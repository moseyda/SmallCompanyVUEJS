<template>
    <main id="settings-page">
      <section class="hero">
        <h1>Settings</h1>
        <p>Manage your account preferences and customise your experience.</p>
      </section>
  
      <section class="settings-container">
        <div class="setting">
          <h2>Profile Settings</h2>
          <label for="name">Name:</label>
          <input id="name" type="text" placeholder="Your Name" />
          <label for="email">Email:</label>
          <input id="email" type="email" placeholder="your@email.com" />
          <button>Save Changes</button>
        </div>
  
        <div class="setting">
          <h2>Account Security</h2>
          <div class="button-group">
            <button>Change Password</button>
            <button>Enable Two-Factor Authentication</button>
            <button>Manage Devices</button>
          </div>
        </div>
  
        <div class="setting">
          <h2>Appearance</h2>
          <label for="theme">Theme:</label>
          <select id="theme">
            <option>Light</option>
            <option>Dark</option>
            <option>System Default</option>
          </select>
        </div>
  
        <div class="setting">
          <h2>Notifications</h2>
          <label>
            <input type="checkbox" /> Email Notifications
          </label>
          <label>
            <input type="checkbox" /> Push Notifications
          </label>
          <label>
            <input type="checkbox" /> SMS Notifications
          </label>
        </div>
  
        <div class="setting">
          <h2>Privacy & Data</h2>
          <div class="button-group">
            <button>Manage Privacy Settings</button>
            <button>Download Your Data</button>
            <button>Delete Account</button>
          </div>
        </div>
      </section>
    </main>
  </template>
  
  <style scoped>
  #settings-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 4rem 2rem;
    color: var(--dark);
  }
  
  .hero {
    margin-bottom: 3rem;
  }
  
  .settings-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 600px;
    width: 100%;
  }
  
  .setting {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: left;
  }
  
  .setting h2 {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin: 0.5rem 0;
    font-weight: 500;
  }
  
  input, select {
    width: 100%;
    padding: 0.7rem;
    margin-bottom: 1rem;
    border-radius: 6px;
    border: 1px solid #ddd;
    font-size: 1rem;
  }
  
  .button-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  button {
    padding: 0.7rem 1.5rem;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  button:hover {
    background: var(--primary-dark);
  }
  </style>
  