import React from 'react';
import { Box, Heading, Image } from 'grommet';

export const Header = () =>
  <Box
    height="xsmall"
    background="accent-3"
    direction="row"
  >
    <Box
      margin={{ "left": "xsmall" }}
      basis="1/3"
      alignSelf="center"
    >
      <Heading>GROMMET TODO</Heading>
    </Box>
    <Box
      basis="2/3"
      fill={true}
    >
      <Image
        fit="cover"
        src="https://v2.grommet.io/img/do-all-things.svg"
      />
    </Box>

  </Box>


export default Header;