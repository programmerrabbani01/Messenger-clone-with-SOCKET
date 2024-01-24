import { Avatar, Box, ChakraProvider } from "@chakra-ui/react";

const UserAvatar = ({ username, style }) => {
  // Generate a color based on the username hash
  const getColor = (username) => {
    // Generate a hash code from the username
    let hash = 0;
    for (let i = 0; i < username?.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert the hash code to a positive number
    const positiveHash = Math.abs(hash);

    // Use the hash code to generate an RGB color
    const red = positiveHash % 255;
    const green = (positiveHash * 2) % 255;
    const blue = (positiveHash * 3) % 255;

    return `rgb(${red}, ${green}, ${blue})`;
  };

  return (
    <ChakraProvider>
      <Box>
        <Avatar name={username} bg={getColor(username)} style={style} />
      </Box>
    </ChakraProvider>
  );
};

export default UserAvatar;
