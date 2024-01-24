import { Avatar, Box, ChakraProvider } from '@chakra-ui/react';
const RandomAvatar = ({ name }) => {
  // Function to generate a random background color based on the user's name
  const generateRandomColor = () => {
    const colors = ['#FF7E67', '#74B3CE', '#93E1D8', '#FFD700', '#A569BD', '#1ABC9C', '#2ECC71', '#3498DB', '#8E44AD', '#C0392B'];
    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
  };

  return (
    <ChakraProvider>
      <Box>
        <Avatar
          name={name}
          bg={generateRandomColor()}
          color="white"
        />
      </Box>
    </ChakraProvider>
  );
};

export default RandomAvatar;
