import { Box, Link } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function NotFound() {
  return (
    <Box>
      <Typography variant="h2">Not Found</Typography>
      <Typography>Could not find requested resource</Typography>
      <Link href="/">Return Home</Link>
    </Box>
  );
}
