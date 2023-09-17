// app.jsx
import React from 'react'; // Import React
import 'antd/dist/reset.css';
import { Button } from 'antd';

// Create a CSS class for the hover effect
const buttonHoverStyles = {
  '&:hover': {
    backgroundColor: 'red', // Change the background color on hover
    color: 'white', // Change the text color on hover
    // Add any other styles you want to apply on hover
  },
};

const App = () => (
  // Apply the hover styles to the Button component
  <>
    <Button type="default" className={`bg-green-500 ${buttonHoverStyles}`}>
      Test Integration
    </Button>
    <Button>Hello</Button>
    <Button type="primary">Hello</Button>
  </>
);

export default App;
